package com.dailyglancer.Rebby;

import co.realtime.reactnativemessagingandroid.RealtimePushNotificationActivity;

public class MainActivity extends RealtimePushNotificationActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Rebby";
    }
}
