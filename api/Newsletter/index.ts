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
import mailchimp = require('@mailchimp/mailchimp_marketing');

const newsletterSignup: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const listId = process.env.MAILCHIMP_LIST_ID;
  if (!listId) {
    context.res = {
      status: 500,
      body: 'Missing MAILCHIMP_LIST_ID!',
    };
    return;
  }
  if (!process.env.MAILCHIMP_KEY) {
    context.res = {
      status: 500,
      body: 'Missing MAILCHIMP_KEY!',
    };
    return;
  }

  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_KEY,
    server: 'us6',
  });

  try {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: req.query.email,
      status: 'subscribed',
    });

    if (response) {
      context.res = {
        status: 200,
        body: 'ok',
      };
    }
  } catch (e) {
    if (e.response.body.title === 'Member Exists') {
      context.res = {
        status: 409,
        body: 'already_subscribed',
      };
      return;
    }

    context.res = {
      status: 500,
      body: e,
    };
  }
};

export default newsletterSignup;
