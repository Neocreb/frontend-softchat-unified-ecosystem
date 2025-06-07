// components/stories/CreateStoryModal.tsx
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Music, Video, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type MediaType = 'audio' | 'video' | 'image' | null;

export const CreateStoryModal = ({
    isOpen,
    onClose,
    onSubmit
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (content: { text?: string; file?: File; type: MediaType }) => void;
}) => {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [mediaType, setMediaType] = useState<MediaType>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: MediaType) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Validate file type
            const validTypes = type === 'audio'
                ? ['audio/mpeg', 'audio/mp3']
                : type === 'video'
                    ? ['video/mp4', 'video/quicktime']
                    : ['image/jpeg', 'image/png', 'image/gif'];

            if (!validTypes.includes(selectedFile.type)) {
                toast({
                    title: 'Invalid file type',
                    description: `Please select a ${type === 'audio' ? 'MP3' : type === 'video' ? 'MP4' : 'JPEG/PNG'} file`,
                    variant: 'destructive'
                });
                return;
            }

            // Check file size (max 25MB)
            if (selectedFile.size > 25 * 1024 * 1024) {
                toast({
                    title: 'File too large',
                    description: 'Maximum file size is 25MB',
                    variant: 'destructive'
                });
                return;
            }

            setFile(selectedFile);
            setMediaType(type);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = () => {
        if (!text && !file) {
            toast({
                title: 'Empty story',
                description: 'Please add text or media to your story',
                variant: 'destructive'
            });
            return;
        }

        onSubmit({ text, file: file || undefined, type: mediaType });
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setText('');
        setFile(null);
        setMediaType(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg w-full max-w-md p-6 relative">
                <button
                    onClick={() => { onClose(); resetForm(); }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4">Create Story</h2>

                <Textarea
                    placeholder="What's on your mind?"
                    className="mb-4 min-h-[100px]"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                {previewUrl && (
                    <div className="relative mb-4">
                        {mediaType === 'image' && (
                            <img src={previewUrl} alt="Preview" className="w-full rounded-lg max-h-60 object-cover" />
                        )}
                        {mediaType === 'video' && (
                            <video
                                src={previewUrl}
                                controls
                                className="w-full rounded-lg max-h-60 object-contain bg-black"
                            />
                        )}
                        {mediaType === 'audio' && (
                            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
                                <Music className="text-gray-500" />
                                <audio src={previewUrl} controls className="flex-1" />
                            </div>
                        )}
                        <button
                            onClick={() => { setFile(null); setPreviewUrl(null); }}
                            className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="flex gap-2 mb-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'image')}
                        className="hidden"
                        id="image-upload"
                    />
                    <Button
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                    >
                        <Image className="mr-2 h-4 w-4" />
                        Photo
                    </Button>

                    <input
                        type="file"
                        accept="video/mp4,video/quicktime"
                        onChange={(e) => handleFileChange(e, 'video')}
                        className="hidden"
                        id="video-upload"
                    />
                    <Button
                        variant="outline"
                        onClick={() => document.getElementById('video-upload')?.click()}
                    >
                        <Video className="mr-2 h-4 w-4" />
                        Video
                    </Button>

                    <input
                        type="file"
                        accept="audio/mpeg,audio/mp3"
                        onChange={(e) => handleFileChange(e, 'audio')}
                        className="hidden"
                        id="audio-upload"
                    />
                    <Button
                        variant="outline"
                        onClick={() => document.getElementById('audio-upload')?.click()}
                    >
                        <Music className="mr-2 h-4 w-4" />
                        Audio
                    </Button>
                </div>

                <Button
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={!text && !file}
                >
                    Post Story
                </Button>
            </div>
        </div>
    );
};