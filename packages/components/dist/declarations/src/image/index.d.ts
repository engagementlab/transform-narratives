declare type ImageProps = {
    alt: string;
    id: string;
    imgId: string;
    className?: string;
    transforms?: string;
    width?: number;
    height?: number;
    lazy?: boolean;
    aspectDefault?: boolean;
};
export declare const Image: ({ alt, className, id, imgId, transforms, width, lazy, aspectDefault }: ImageProps) => JSX.Element;
export {};
