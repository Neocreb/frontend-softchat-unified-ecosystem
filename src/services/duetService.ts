/**
 * Duet Service
 * Handles client-side duet operations and API interactions
 */

export interface DuetData {
  id: string;
  content: string;
  videoUrl: string;
  thumbnailUrl: string;
  duetStyle: 'side-by-side' | 'react-respond' | 'picture-in-picture';
  audioSource: 'original' | 'both' | 'voiceover';
  createdAt: string;
  creator: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
    isVerified: boolean;
  };
}

export interface OriginalVideoData {
  id: string;
  videoUrl: string;
  content: string;
  createdAt: string;
  isDuet: boolean;
  duetOfPostId?: string;
  originalCreatorId?: string;
  originalCreatorUsername?: string;
  creator: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
    isVerified: boolean;
  };
}

export interface DuetChain {
  rootPostId: string;
  duetCount: number;
  duets: DuetData[];
}

export interface DuetStats {
  totalDuets: number;
  styleBreakdown: {
    'side-by-side': number;
    'react-respond': number;
    'picture-in-picture': number;
  };
  audioBreakdown: {
    original: number;
    both: number;
    voiceover: number;
  };
}

class DuetService {
  private baseUrl = '/api/duets';

  /**
   * Get original video data for duet creation
   */
  async getOriginalVideoData(postId: string): Promise<OriginalVideoData> {
    try {
      const response = await fetch(`${this.baseUrl}/original/${postId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch original video data');
      }

      return {
        id: data.data.originalPost.id,
        videoUrl: data.data.originalPost.videoUrl,
        content: data.data.originalPost.content,
        createdAt: data.data.originalPost.createdAt,
        isDuet: data.data.originalPost.isDuet,
        duetOfPostId: data.data.originalPost.duetOfPostId,
        originalCreatorId: data.data.originalPost.originalCreatorId,
        originalCreatorUsername: data.data.originalPost.originalCreatorUsername,
        creator: data.data.creator,
      };
    } catch (error) {
      console.error('Error fetching original video data:', error);
      throw error;
    }
  }

  /**
   * Create a new duet
   */
  async createDuet(
    originalPostId: string,
    duetVideoBlob: Blob,
    thumbnailBlob: Blob | null,
    duetStyle: 'side-by-side' | 'react-respond' | 'picture-in-picture',
    audioSource: 'original' | 'both' | 'voiceover',
    caption: string,
    tags: string[] = []
  ): Promise<DuetData> {
    try {
      const formData = new FormData();
      formData.append('duetVideo', duetVideoBlob, 'duet-video.webm');
      
      if (thumbnailBlob) {
        formData.append('thumbnail', thumbnailBlob, 'thumbnail.jpg');
      }

      formData.append('originalPostId', originalPostId);
      formData.append('duetStyle', duetStyle);
      formData.append('audioSource', audioSource);
      formData.append('caption', caption);
      
      // Add tags as separate form entries
      tags.forEach(tag => {
        formData.append('tags', tag);
      });

      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create duet');
      }

      return data.data.duetPost;
    } catch (error) {
      console.error('Error creating duet:', error);
      throw error;
    }
  }

  /**
   * Get duet chain for a post
   */
  async getDuetChain(postId: string): Promise<DuetChain> {
    try {
      const response = await fetch(`${this.baseUrl}/chain/${postId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch duet chain');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching duet chain:', error);
      throw error;
    }
  }

  /**
   * Get user's duets
   */
  async getUserDuets(userId: string): Promise<DuetData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user duets');
      }

      return data.data.duets;
    } catch (error) {
      console.error('Error fetching user duets:', error);
      throw error;
    }
  }

  /**
   * Delete a duet
   */
  async deleteDuet(postId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${postId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete duet');
      }
    } catch (error) {
      console.error('Error deleting duet:', error);
      throw error;
    }
  }

  /**
   * Get duet statistics for a post
   */
  async getDuetStats(postId: string): Promise<DuetStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats/${postId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch duet stats');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching duet stats:', error);
      throw error;
    }
  }

  /**
   * Check if user can create duet for a video
   */
  async canCreateDuet(postId: string): Promise<boolean> {
    try {
      const originalData = await this.getOriginalVideoData(postId);
      return !!originalData.videoUrl;
    } catch (error) {
      console.error('Error checking duet eligibility:', error);
      return false;
    }
  }

  /**
   * Get duet preview data (for previewing before creation)
   */
  async getDuetPreviewData(postId: string): Promise<{
    originalVideo: {
      url: string;
      duration: number;
      thumbnail?: string;
    };
    creator: {
      username: string;
      avatar: string;
      isVerified: boolean;
    };
  }> {
    try {
      const originalData = await this.getOriginalVideoData(postId);
      
      // For preview, we need to get video duration
      const videoDuration = await this.getVideoDuration(originalData.videoUrl);
      
      return {
        originalVideo: {
          url: originalData.videoUrl,
          duration: videoDuration,
          thumbnail: undefined, // Could be extracted from video
        },
        creator: originalData.creator,
      };
    } catch (error) {
      console.error('Error getting duet preview data:', error);
      throw error;
    }
  }

  /**
   * Get video duration from URL
   */
  private async getVideoDuration(videoUrl: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video metadata'));
      };
      
      video.src = videoUrl;
    });
  }

  /**
   * Generate duet caption suggestion
   */
  generateDuetCaption(originalCreatorUsername: string, duetStyle: string): string {
    const suggestions = {
      'side-by-side': [
        `Duet with @${originalCreatorUsername} 🎭`,
        `Vibing with @${originalCreatorUsername} ✨`,
        `Side by side with @${originalCreatorUsername} 🤝`,
      ],
      'react-respond': [
        `Reacting to @${originalCreatorUsername} 😮`,
        `My response to @${originalCreatorUsername} 💭`,
        `What I think about @${originalCreatorUsername}'s take 🤔`,
      ],
      'picture-in-picture': [
        `Joining @${originalCreatorUsername} 📱`,
        `My take on @${originalCreatorUsername}'s video 🎬`,
        `Adding to @${originalCreatorUsername}'s moment ➕`,
      ],
    };

    const styleSuggestions = suggestions[duetStyle as keyof typeof suggestions] || suggestions['side-by-side'];
    return styleSuggestions[Math.floor(Math.random() * styleSuggestions.length)];
  }

  /**
   * Generate trending duet hashtags
   */
  generateDuetTags(originalCreatorUsername: string, duetStyle: string): string[] {
    const baseTags = ['duet', originalCreatorUsername];
    
    const styleTags = {
      'side-by-side': ['sidebyside', 'collaboration', 'together'],
      'react-respond': ['reaction', 'response', 'reply'],
      'picture-in-picture': ['pip', 'overlay', 'join'],
    };

    const trending = ['viral', 'fyp', 'trending', 'collab', 'fun', 'creative'];
    
    return [
      ...baseTags,
      ...(styleTags[duetStyle as keyof typeof styleTags] || []),
      ...trending.slice(0, 2), // Add 2 trending tags
    ];
  }

  /**
   * Validate duet video requirements
   */
  validateDuetVideo(videoBlob: Blob): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    return new Promise((resolve) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Check file size (max 100MB)
      if (videoBlob.size > 100 * 1024 * 1024) {
        errors.push('Video file size exceeds 100MB limit');
      }

      // Check file type
      if (!videoBlob.type.startsWith('video/')) {
        errors.push('File must be a video format');
      }

      // Check if video is too short or too long
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        if (video.duration < 1) {
          errors.push('Video must be at least 1 second long');
        }
        
        if (video.duration > 180) {
          warnings.push('Video is longer than 3 minutes - consider shortening for better engagement');
        }

        resolve({
          isValid: errors.length === 0,
          errors,
          warnings,
        });
      };

      video.onerror = () => {
        errors.push('Unable to process video file');
        resolve({
          isValid: false,
          errors,
          warnings,
        });
      };

      video.src = URL.createObjectURL(videoBlob);
    });
  }
}

export const duetService = new DuetService();
export default duetService;
