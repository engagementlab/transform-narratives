import { InferRenderersForComponentBlocks } from "@keystone-6/fields-document/component-blocks";
export declare const BlockRenderers: (imageOveride?: {
    (props: any): JSX.Element;
    (arg0: any): any;
}) => InferRenderersForComponentBlocks<{
    image: import("@keystone-6/fields-document/component-blocks").ComponentBlock<{
        image: import("@keystone-6/fields-document/component-blocks").FormField<import("../../../../apps/cms/admin/components/component-blocks").RelatedImage, undefined>;
    }>;
    video: import("@keystone-6/fields-document/component-blocks").ComponentBlock<{
        video: import("@keystone-6/fields-document/component-blocks").FormField<import("../../../../apps/cms/admin/components/component-blocks").RelatedVideo, undefined>;
    }>;
    button: import("@keystone-6/fields-document/component-blocks").ComponentBlock<{
        label: import("@keystone-6/fields-document/component-blocks").ChildField;
        link: import("@keystone-6/fields-document/component-blocks").ChildField;
    }>;
}>;
