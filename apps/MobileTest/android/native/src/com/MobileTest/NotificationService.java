package com.MobileTest;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

public class NotificationService extends IntentService {

	private NotificationManager nM;
	private XMPPConn xmppConn = null;
	private String login;

	public NotificationService() {
		this("teste");
	}

	public NotificationService(String name) {
		super(name);
	}

	@Override
	protected void onHandleIntent(Intent workIntent) {
		// Gets data from the incoming Intent
		String dataString = workIntent.getDataString();
		final String login = workIntent.getExtras().getString("login");
		// Do work here, based on the contents of dataString

		this.xmppConn = new XMPPConn(this);
		Thread t = new Thread() {
			@Override
			public void run() {
				try {
					xmppConn.connect(login);
					nM = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
					while (true) {
						Thread.sleep(5000);
						System.out.println("Time: "
								+ System.currentTimeMillis());
					}
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		};
		t.start();
	}

	public void sendNotify(String from, String value) {
		Intent resultIntent = new Intent(this, MobileTest.class);
		// Because clicking the notification opens a new ("special") activity,
		// there's
		// no need to create an artificial back stack.
		PendingIntent resultPendingIntent = PendingIntent.getActivity(this, 0,
				resultIntent, PendingIntent.FLAG_UPDATE_CURRENT);
		Notification notif = new Notification.Builder(
				this.getApplicationContext())
				.setContentTitle("De: " + from)
				.setContentText(value).setSmallIcon(R.drawable.push)
				.setContentIntent(resultPendingIntent).build();
		NotificationManager notify = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
		notify.notify(001, notif);
	}

}