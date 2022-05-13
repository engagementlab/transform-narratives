/**
 * @fileoverview Engagement Lab initiatives content service
 * @copyright Engagement Lab at Emerson College, 2022
 *
 * @author Johnny Richardson
 * @description
 *
 * ==========
 */

import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { request } from '@octokit/request';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const repoName = req.query.name;
  const workflowError = `We were unable to get the status of this deployment, however you should be able to find its status here: https://github.com/engagementlab/${repoName}/actions`;

  if (!repoName) {
    context.res = {
      status: 400,
      err: true,
      body: 'Missing repo name',
    };
    return;
  }

  const requestWithAuth = request.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  try {
    const dispatchResponse = await requestWithAuth(
      'POST /repos/{owner}/{repo}/dispatches',
      {
        owner: 'engagementlab',
        repo: repoName,
        event_type: 'deploy-prod',
      }
    );

    // If dispatch to trigger workflow succeeded, get all action runs and pull latest ID after a brief delay, send
    if (dispatchResponse.status === 204) {
      const getStatus = () =>
        new Promise<void>((resolve, reject) => {
          setTimeout(async () => {
            try {
              const workflowResponse = await requestWithAuth(
                'GET /repos/{owner}/{repo}/actions/runs?event=repository_dispatch',
                {
                  owner: 'engagementlab',
                  repo: repoName,
                }
              );

              if (workflowResponse.status === 200) {
                context.res = {
                  status: 200,
                  body: {
                    repo: repoName,
                    id: workflowResponse.data.workflow_runs[0].id,
                  },
                };
                resolve();
              } else {
                context.res = {
                  status: 500,
                  body: workflowError,
                };
                reject();
              }
            } catch (e) {
              context.res = {
                status: 500,
                body: workflowError,
              };
            }
          }, 5000);
        });

      await getStatus();
    }
  } catch (e) {
    context.res = {
      status: 500,
      body: `Github status: ${e}`,
    };
  }
};

export default httpTrigger;
