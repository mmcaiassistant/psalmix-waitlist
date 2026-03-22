import fs from 'fs';
import path from 'path';

/**
 * Email sending utility for PsalMix Waitlist
 * Currently logs emails to console, ready for Resend integration
 */

interface EmailVariables {
  [key: string]: string | number;
}

interface EmailOptions {
  to: string;
  subject: string;
  template: 'welcome' | 'progress' | 'reward-unlocked' | 'launch';
  variables: EmailVariables;
}

/**
 * Load and render an email template with variables
 */
function renderTemplate(templateName: string, variables: EmailVariables): string {
  const templatePath = path.join(process.cwd(), 'src', 'emails', `${templateName}.html`);
  
  try {
    let template = fs.readFileSync(templatePath, 'utf-8');
    
    // Replace all {{variable}} placeholders with actual values
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, String(value));
    });
    
    return template;
  } catch (error) {
    console.error(`Failed to load template ${templateName}:`, error);
    throw new Error(`Template ${templateName} not found`);
  }
}

/**
 * Get email subject based on template and variables
 */
function getEmailSubject(template: string, variables: EmailVariables): string {
  const subjects = {
    'welcome': "You're in! Here's how to skip the line ⏩",
    'progress': `${variables.name}, you moved up! 📈`,
    'reward-unlocked': `🎁 You unlocked: ${variables.reward}!`,
    'launch': `🎉 ${variables.name}, PsalMix is LIVE!`
  };
  
  return subjects[template as keyof typeof subjects] || 'PsalMix Update';
}

/**
 * Send an email (stub for now, ready for Resend)
 * @param to - Recipient email address
 * @param template - Template name (welcome, progress, reward-unlocked, launch)
 * @param variables - Variables to inject into template
 */
export async function sendEmail(
  to: string,
  template: 'welcome' | 'progress' | 'reward-unlocked' | 'launch',
  variables: EmailVariables
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Render the template
    const html = renderTemplate(template, variables);
    const subject = getEmailSubject(template, variables);
    
    // TODO: Integrate with Resend
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // const result = await resend.emails.send({
    //   from: 'PsalMix <waitlist@psalmix.app>',
    //   to,
    //   subject,
    //   html,
    // });
    
    // For now, just log the email
    console.log('📧 EMAIL SENT (simulated)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Template: ${template}`);
    console.log('Variables:', JSON.stringify(variables, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return {
      success: true,
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send welcome email to new signup
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  position: number,
  referralLink: string
) {
  return sendEmail(email, 'welcome', {
    name,
    position,
    referral_link: referralLink
  });
}

/**
 * Send progress update email
 */
export async function sendProgressEmail(
  email: string,
  name: string,
  position: number,
  referralCount: number,
  nextReward: string,
  nextRewardIcon: string,
  referralsNeeded: number,
  progressPercentage: number,
  referralLink: string
) {
  return sendEmail(email, 'progress', {
    name,
    position,
    referral_count: referralCount,
    next_reward: nextReward,
    next_reward_icon: nextRewardIcon,
    referrals_needed: referralsNeeded,
    progress_percentage: progressPercentage,
    referral_link: referralLink
  });
}

/**
 * Send reward unlocked email
 */
export async function sendRewardUnlockedEmail(
  email: string,
  name: string,
  reward: string,
  badge: string,
  badgeName: string,
  referralLink: string
) {
  return sendEmail(email, 'reward-unlocked', {
    name,
    reward,
    badge,
    badge_name: badgeName,
    referral_link: referralLink
  });
}

/**
 * Send launch email
 */
export async function sendLaunchEmail(
  email: string,
  name: string,
  rewardsSummary: string,
  appStoreLink: string,
  playStoreLink: string
) {
  return sendEmail(email, 'launch', {
    name,
    rewards_summary: rewardsSummary,
    app_store_link: appStoreLink,
    play_store_link: playStoreLink
  });
}

/**
 * Helper to generate rewards summary HTML for launch email
 */
export function generateRewardsSummaryHTML(rewards: string[]): string {
  if (rewards.length === 0) {
    return `
      <div class="reward-item">
        <span class="reward-check">✅</span>
        <span class="reward-text">Early Access Status</span>
      </div>
    `;
  }
  
  return rewards.map(reward => `
    <div class="reward-item">
      <span class="reward-check">✅</span>
      <span class="reward-text">${reward}</span>
    </div>
  `).join('');
}
