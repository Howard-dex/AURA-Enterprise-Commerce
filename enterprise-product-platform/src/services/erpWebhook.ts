export interface LeadWebhookPayload {
  inquiryId: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  cooperationType: string;
  estimatedQty: number;
  productSku?: string;
}

/**
 * 异步将高价值大客户采购线索同步至飞书/企业微信群机器人与 Salesforce CRM
 */
export async function notifyEnterpriseCrm(payload: LeadWebhookPayload): Promise<boolean> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  if (!webhookUrl) return true;

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msg_type: 'interactive',
        card: {
          header: {
            title: { tag: 'plain_text', content: `🔥 新企业采购线索: ${payload.companyName}` }
          },
          elements: [
            {
              tag: 'div',
              text: {
                tag: 'lark_md',
                content: `**联系人:** ${payload.contactPerson} (${payload.contactPhone})\n**合作类型:** ${payload.cooperationType}\n**预计采购量:** ${payload.estimatedQty} 台`
              }
            }
          ]
        }
      })
    });
    return res.ok;
  } catch (err) {
    console.error('[CRM_WEBHOOK_ERROR]', err);
    return false;
  }
}
