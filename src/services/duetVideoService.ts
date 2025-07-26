/**
 * Duet Video Service
 * Handles video merging, processing, and duet creation
 */

export interface DuetVideoOptions {
  originalVideoBlob: Blob;
  userVideoBlob: Blob;
  duetStyle: 'side-by-side' | 'react-respond' | 'picture-in-picture';
  audioSource: 'original' | 'both' | 'voiceover';
  originalAudioVolume: number;
  userAudioVolume: number;
  duration: number;
}

export interface ProcessedDuetVideo {
  videoBlob: Blob;
  thumbnailBlob: Blob;
  duration: number;
  width: number;
  height: number;
}

class DuetVideoService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mediaRecorder: MediaRecorder | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Merge two videos into a duet video
   */
  async mergeVideos(options: DuetVideoOptions): Promise<ProcessedDuetVideo> {
    const {
      originalVideoBlob,
      userVideoBlob,
      duetStyle,
      audioSource,
      originalAudioVolume,
      userAudioVolume,
      duration
    } = options;

    try {
      // Create video elements
      const originalVideo = await this.createVideoElement(originalVideoBlob);
      const userVideo = await this.createVideoElement(userVideoBlob);

      // Setup canvas based on duet style
      this.setupCanvas(duetStyle);

      // Create media streams for audio mixing
      const audioContext = new AudioContext();
      const mixedAudioStream = await this.createMixedAudioStream(
        originalVideo,
        userVideo,
        audioSource,
        originalAudioVolume,
        userAudioVolume,
        audioContext
      );

      // Merge video streams
      const mergedVideoBlob = await this.mergeVideoStreams(
        originalVideo,
        userVideo,
        mixedAudioStream,
        duetStyle,
        duration
      );

      // Generate thumbnail
      const thumbnailBlob = await this.generateThumbnail(originalVideo, userVideo, duetStyle);

      // Get video dimensions
      const { width, height } = this.getVideoDimensions(duetStyle);

      return {
        videoBlob: mergedVideoBlob,
        thumbnailBlob,
        duration,
        width,
        height
      };

    } catch (error) {
      console.error('Error merging videos:', error);
      throw new Error('Failed to merge videos');
    }
  }

  /**
   * Create video element from blob
   */
  private createVideoElement(blob: Blob): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        video.currentTime = 0;
        resolve(video);
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video'));
      };
      
      video.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Setup canvas dimensions based on duet style
   */
  private setupCanvas(duetStyle: string) {
    switch (duetStyle) {
      case 'side-by-side':
        this.canvas.width = 1080;
        this.canvas.height = 1920;
        break;
      case 'picture-in-picture':
        this.canvas.width = 720;
        this.canvas.height = 1280;
        break;
      case 'react-respond':
        this.canvas.width = 720;
        this.canvas.height = 1280;
        break;
      default:
        this.canvas.width = 720;
        this.canvas.height = 1280;
    }
  }

  /**
   * Create mixed audio stream
   */
  private async createMixedAudioStream(
    originalVideo: HTMLVideoElement,
    userVideo: HTMLVideoElement,
    audioSource: string,
    originalVolume: number,
    userVolume: number,
    audioContext: AudioContext
  ): Promise<MediaStream> {
    try {
      const destination = audioContext.createMediaStreamDestination();

      if (audioSource === 'original' || audioSource === 'both') {
        // Add original video audio
        const originalSource = audioContext.createMediaElementSource(originalVideo);
        const originalGain = audioContext.createGain();
        originalGain.gain.value = originalVolume / 100;
        
        originalSource.connect(originalGain);
        originalGain.connect(destination);
      }

      if (audioSource === 'voiceover' || audioSource === 'both') {
        // Add user video audio (microphone)
        const userSource = audioContext.createMediaElementSource(userVideo);
        const userGain = audioContext.createGain();
        userGain.gain.value = userVolume / 100;
        
        userSource.connect(userGain);
        userGain.connect(destination);
      }

      return destination.stream;
    } catch (error) {
      console.error('Error creating mixed audio:', error);
      // Return empty audio stream as fallback
      return new MediaStream();
    }
  }

  /**
   * Merge video streams with different layouts
   */
  private async mergeVideoStreams(
    originalVideo: HTMLVideoElement,
    userVideo: HTMLVideoElement,
    audioStream: MediaStream,
    duetStyle: string,
    duration: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const stream = this.canvas.captureStream(30);
      
      // Add audio track to video stream
      if (audioStream.getAudioTracks().length > 0) {
        stream.addTrack(audioStream.getAudioTracks()[0]);
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };

      mediaRecorder.onerror = (error) => {
        reject(error);
      };

      // Start recording
      mediaRecorder.start(100);

      // Start video playback
      originalVideo.currentTime = 0;
      userVideo.currentTime = 0;
      originalVideo.play();
      userVideo.play();

      // Draw frames
      const startTime = Date.now();
      const drawFrame = () => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed >= duration * 1000) {
          mediaRecorder.stop();
          originalVideo.pause();
          userVideo.pause();
          return;
        }

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw based on duet style
        this.drawDuetFrame(originalVideo, userVideo, duetStyle);

        requestAnimationFrame(drawFrame);
      };

      drawFrame();
    });
  }

  /**
   * Draw duet frame based on style
   */
  private drawDuetFrame(
    originalVideo: HTMLVideoElement,
    userVideo: HTMLVideoElement,
    duetStyle: string
  ) {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    switch (duetStyle) {
      case 'side-by-side':
        // Original video on the left
        this.ctx.drawImage(
          originalVideo,
          0, 0,
          canvasWidth / 2, canvasHeight
        );
        
        // User video on the right (flipped)
        this.ctx.save();
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(
          userVideo,
          -canvasWidth, 0,
          canvasWidth / 2, canvasHeight
        );
        this.ctx.restore();
        
        // Add separator line
        this.ctx.strokeStyle = '#ffffff33';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(canvasWidth / 2, 0);
        this.ctx.lineTo(canvasWidth / 2, canvasHeight);
        this.ctx.stroke();
        break;

      case 'picture-in-picture':
        // Original video as background
        this.ctx.drawImage(originalVideo, 0, 0, canvasWidth, canvasHeight);
        
        // User video as small overlay (bottom right)
        const pipWidth = canvasWidth * 0.3;
        const pipHeight = canvasHeight * 0.25;
        const pipX = canvasWidth - pipWidth - 20;
        const pipY = canvasHeight - pipHeight - 20;
        
        // Draw border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(pipX - 3, pipY - 3, pipWidth + 6, pipHeight + 6);
        
        // Draw user video (flipped)
        this.ctx.save();
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(
          userVideo,
          -(pipX + pipWidth), pipY,
          pipWidth, pipHeight
        );
        this.ctx.restore();
        break;

      case 'react-respond':
        // Original video on top
        this.ctx.drawImage(
          originalVideo,
          0, 0,
          canvasWidth, canvasHeight / 2
        );
        
        // User video on bottom (flipped)
        this.ctx.save();
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(
          userVideo,
          -canvasWidth, canvasHeight / 2,
          canvasWidth, canvasHeight / 2
        );
        this.ctx.restore();
        
        // Add separator line
        this.ctx.strokeStyle = '#ffffff33';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, canvasHeight / 2);
        this.ctx.lineTo(canvasWidth, canvasHeight / 2);
        this.ctx.stroke();
        break;
    }
  }

  /**
   * Generate thumbnail from duet video
   */
  private async generateThumbnail(
    originalVideo: HTMLVideoElement,
    userVideo: HTMLVideoElement,
    duetStyle: string
  ): Promise<Blob> {
    // Create temporary canvas for thumbnail
    const thumbCanvas = document.createElement('canvas');
    const thumbCtx = thumbCanvas.getContext('2d')!;
    
    thumbCanvas.width = 360;
    thumbCanvas.height = 640;

    // Set video time to middle for thumbnail
    originalVideo.currentTime = originalVideo.duration / 2;
    userVideo.currentTime = userVideo.duration / 2;

    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for seek

    // Draw thumbnail frame
    thumbCtx.clearRect(0, 0, thumbCanvas.width, thumbCanvas.height);
    
    switch (duetStyle) {
      case 'side-by-side':
        thumbCtx.drawImage(originalVideo, 0, 0, thumbCanvas.width / 2, thumbCanvas.height);
        thumbCtx.save();
        thumbCtx.scale(-1, 1);
        thumbCtx.drawImage(userVideo, -thumbCanvas.width, 0, thumbCanvas.width / 2, thumbCanvas.height);
        thumbCtx.restore();
        break;
      case 'picture-in-picture':
        thumbCtx.drawImage(originalVideo, 0, 0, thumbCanvas.width, thumbCanvas.height);
        const pipW = thumbCanvas.width * 0.3;
        const pipH = thumbCanvas.height * 0.25;
        thumbCtx.save();
        thumbCtx.scale(-1, 1);
        thumbCtx.drawImage(userVideo, -(thumbCanvas.width - 20), thumbCanvas.height - pipH - 20, pipW, pipH);
        thumbCtx.restore();
        break;
      case 'react-respond':
        thumbCtx.drawImage(originalVideo, 0, 0, thumbCanvas.width, thumbCanvas.height / 2);
        thumbCtx.save();
        thumbCtx.scale(-1, 1);
        thumbCtx.drawImage(userVideo, -thumbCanvas.width, thumbCanvas.height / 2, thumbCanvas.width, thumbCanvas.height / 2);
        thumbCtx.restore();
        break;
    }

    return new Promise((resolve) => {
      thumbCanvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.8);
    });
  }

  /**
   * Get video dimensions based on duet style
   */
  private getVideoDimensions(duetStyle: string): { width: number; height: number } {
    switch (duetStyle) {
      case 'side-by-side':
        return { width: 1080, height: 1920 };
      case 'picture-in-picture':
      case 'react-respond':
      default:
        return { width: 720, height: 1280 };
    }
  }

  /**
   * Convert blob to base64 for upload
   */
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Create video from URL for processing
   */
  async createVideoFromUrl(url: string): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        resolve(video);
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video from URL'));
      };
      
      video.src = url;
    });
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }
  }
}

export const duetVideoService = new DuetVideoService();
export default duetVideoService;
