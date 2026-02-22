import * as Notifications from 'expo-notifications';

// Uygulama ön plandayken bildirimlerin nasıl gösterileceği
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const IDS = {
  reminder: 'daily-reminder',
  suggestion: 'daily-suggestion',
  news: 'weekly-news',
};

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function scheduleReminder() {
  await Notifications.scheduleNotificationAsync({
    identifier: IDS.reminder,
    content: {
      title: 'Bugün ne yaptın? 🌟',
      body: 'Bir aktivite dene, kendini iyi hissedeceksin!',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

async function scheduleSuggestion() {
  await Notifications.scheduleNotificationAsync({
    identifier: IDS.suggestion,
    content: {
      title: 'Bugün ne yapacaksın? 💡',
      body: 'Sana özel aktivite önerilerin hazır!',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 10,
      minute: 0,
    },
  });
}

async function scheduleNews() {
  await Notifications.scheduleNotificationAsync({
    identifier: IDS.news,
    content: {
      title: 'Haftanın aktiviteleri hazır! 🎉',
      body: 'Yeni öneriler seni bekliyor, bir göz at!',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1, // Pazartesi
      hour: 12,
      minute: 0,
    },
  });
}

export async function syncNotifications(state: {
  notificationsEnabled: boolean;
  notifyReminders: boolean;
  notifyActivitySuggestions: boolean;
  notifyAppNews: boolean;
}): Promise<void> {
  if (!state.notificationsEnabled) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return;
  }

  if (state.notifyReminders) {
    await scheduleReminder();
  } else {
    await Notifications.cancelScheduledNotificationAsync(IDS.reminder);
  }

  if (state.notifyActivitySuggestions) {
    await scheduleSuggestion();
  } else {
    await Notifications.cancelScheduledNotificationAsync(IDS.suggestion);
  }

  if (state.notifyAppNews) {
    await scheduleNews();
  } else {
    await Notifications.cancelScheduledNotificationAsync(IDS.news);
  }
}
