
import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, Loader2 } from 'lucide-react';

interface ImageCropperProps {
    imageSrc: string;
    aspectRatio: number; // e.g., 1 for square, 4/3 for landscape, 3/4 for portrait
    onCropComplete: (croppedImageBlob: Blob) => void;
    onCancel: () => void;
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

const ImageCropper: React.FC<ImageCropperProps> = ({
    imageSrc,
    aspectRatio,
    onCropComplete,
    onCancel,
}) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isProcessing, setIsProcessing] = useState(false);

    const onImageLoad = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspectRatio));
        },
        [aspectRatio]
    );

    const getCroppedImg = useCallback(async () => {
        if (!completedCrop || !imgRef.current) return null;

        const canvas = document.createElement('canvas');
        const image = imgRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        return new Promise<Blob | null>((resolve) => {
            canvas.toBlob(
                (blob) => {
                    resolve(blob);
                },
                'image/jpeg',
                0.92
            );
        });
    }, [completedCrop]);

    const handleCropConfirm = async () => {
        setIsProcessing(true);
        const croppedBlob = await getCroppedImg();
        setIsProcessing(false);
        if (croppedBlob) {
            onCropComplete(croppedBlob);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase">Crop Image</h3>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="flex-1 overflow-auto p-4 bg-gray-100 flex items-center justify-center">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspectRatio}
                        className="max-h-[60vh]"
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop preview"
                            onLoad={onImageLoad}
                            className="max-h-[60vh] object-contain"
                            crossOrigin="anonymous"
                        />
                    </ReactCrop>
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex gap-4 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCropConfirm}
                        disabled={!completedCrop || isProcessing}
                        className="px-6 py-3 bg-cat-black text-white rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Check size={20} />
                                Apply Crop
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
