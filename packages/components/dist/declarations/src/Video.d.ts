declare type VideoProps = {
    thumbUrl: string;
    videoUrl: string;
    videoLabel: string;
};
declare const Video: ({ thumbUrl, videoUrl, videoLabel, }: VideoProps) => JSX.Element;
export default Video;
