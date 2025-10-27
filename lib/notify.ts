import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface NotificationData {
  userId: string;
  type: 'badge.earned' | 'level.up' | 'streak.reminder' | 'progress.milestone';
  data: Record<string, unknown>;
}

/**
 * Abstracted notification system
 * 
 * Currently uses Resend for email notifications.
 * Can be extended to support push notifications by adding
 * additional transport methods.
 */
export async function notifyUser(params: NotificationData): Promise<void> {
  try {
    // Get user email (would fetch from database)
    const userEmail = await getUserEmail(params.userId);
    if (!userEmail) {
      console.warn(`No email found for user ${params.userId}`);
      return;
    }

    switch (params.type) {
      case 'badge.earned':
        await sendBadgeEarnedEmail(userEmail, params.data);
        break;
      
      case 'level.up':
        await sendLevelUpEmail(userEmail, params.data);
        break;
      
      case 'streak.reminder':
        await sendStreakReminderEmail(userEmail, params.data);
        break;
      
      case 'progress.milestone':
        await sendProgressMilestoneEmail(userEmail, params.data);
        break;
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

async function getUserEmail(userId: string): Promise<string | null> {
  // TODO: Fetch from database
  return 'user@example.com'; // Stub
}

async function sendBadgeEarnedEmail(email: string, data: Record<string, unknown>) {
  const { badgeName, badgeDescription } = data;

  await resend.emails.send({
    from: 'Whop Gamify <notifications@whopgamify.com>',
    to: email,
    subject: `🏆 You earned: ${badgeName}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C5CFC;">New Badge Unlocked!</h1>
        <p style="font-size: 18px;">Congratulations! You've earned the <strong>${badgeName}</strong> badge.</p>
        <p style="color: #666;">${badgeDescription}</p>
        <a href="${process.env.APP_URL}/badges" style="display: inline-block; padding: 12px 24px; background: #7C5CFC; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          View All Badges
        </a>
      </div>
    `,
  });
}

async function sendLevelUpEmail(email: string, data: Record<string, unknown>) {
  const { newLevel, pointsEarned } = data;

  await resend.emails.send({
    from: 'Whop Gamify <notifications@whopgamify.com>',
    to: email,
    subject: `🎉 Level ${newLevel} Unlocked!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C5CFC;">Level Up!</h1>
        <p style="font-size: 18px;">You've reached <strong>Level ${newLevel}</strong>!</p>
        <p style="color: #666;">You've earned ${pointsEarned} points total. Keep going!</p>
        <a href="${process.env.APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #7C5CFC; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          View Dashboard
        </a>
      </div>
    `,
  });
}

async function sendStreakReminderEmail(email: string, data: Record<string, unknown>) {
  const { streakDays } = data;

  await resend.emails.send({
    from: 'Whop Gamify <notifications@whopgamify.com>',
    to: email,
    subject: `🔥 Don't break your ${streakDays}-day streak!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F59E0B;">Streak Alert!</h1>
        <p style="font-size: 18px;">You're on a <strong>${streakDays}-day streak</strong>!</p>
        <p style="color: #666;">Log in today to keep it going and earn bonus points.</p>
        <a href="${process.env.APP_URL}" style="display: inline-block; padding: 12px 24px; background: #F59E0B; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Continue Learning
        </a>
      </div>
    `,
  });
}

async function sendProgressMilestoneEmail(email: string, data: Record<string, unknown>) {
  const { percent, courseName } = data;

  await resend.emails.send({
    from: 'Whop Gamify <notifications@whopgamify.com>',
    to: email,
    subject: `🎯 You're ${percent}% done with ${courseName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22C55E;">Great Progress!</h1>
        <p style="font-size: 18px;">You're <strong>${percent}% complete</strong> with ${courseName}.</p>
        <p style="color: #666;">You're almost there! Keep it up.</p>
        <a href="${process.env.APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #22C55E; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Continue Course
        </a>
      </div>
    `,
  });
}

/**
 * Export for use in other modules
 */
export const notify = {
  user: notifyUser,
};
