import { PageContainer } from '@keystone-6/core/admin-ui/components';
export default function Deploy () {
    return (
        <PageContainer header="Deploy to Production">
            <h1>Deployment Center</h1>
            <p>This action will copy the content from the current QA build to production. Before doing this, please ensure the QA build is free of all content issues and any bugs that may be caused by missing or poor-quality content (e.g. images). This action is not easily reversible, and all content from QA will generally be immediately viewable by all users.</p>
        </PageContainer>
    )

}