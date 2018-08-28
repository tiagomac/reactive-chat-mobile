package com.MobileTest;

import java.util.ArrayList;

import org.jivesoftware.smack.ConnectionConfiguration;
import org.jivesoftware.smack.ConnectionConfiguration.SecurityMode;
import org.jivesoftware.smack.PacketListener;
import org.jivesoftware.smack.XMPPConnection;
import org.jivesoftware.smack.filter.MessageTypeFilter;
import org.jivesoftware.smack.filter.PacketFilter;
import org.jivesoftware.smack.packet.Message;
import org.jivesoftware.smack.packet.Packet;
import org.jivesoftware.smack.util.StringUtils;

import android.util.Log;

public class XMPPConn {

	private ArrayList<String> messages = new ArrayList();

	private String serviceName = "saturn";
	private String host = "45.55.164.136";
	private int port = 5222;
	private String user = "";
	private String pwd = "123456";
	private XMPPConnection connection = null;
	private NotificationService ns = null;

	public XMPPConn(NotificationService ns) {
		this.ns = ns;
	}

	public void connect(String login) {
		ConnectionConfiguration connConfig = new ConnectionConfiguration(host,
				port, serviceName); // service
//		connConfig.setSASLAuthenticationEnabled(false);
		connConfig.setSecurityMode(SecurityMode.disabled);
		XMPPConnection connection = new XMPPConnection(connConfig);
		this.user = login;
		try {
			connection.connect();
			connection.login(user, pwd, "resource");
			Log.i("XMPPClient", "Logged in as " + connection.getUser());
//			Presence presence = new Presence(Presence.Type.available);
//			connection.sendPacket(presence);
			setConnection(connection);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Called when a connection is establised with the XMPP server
	 * @param connection
	 */
	public void setConnection(XMPPConnection connection) {
		this.connection = connection;
		if (connection != null) {
			// Add a packet listener to get messages sent to us
			PacketFilter filter = new MessageTypeFilter(Message.Type.chat);
			connection.addPacketListener(new PacketListener() {
				public void processPacket(Packet packet) {
					Message message = (Message) packet;
					if (message.getBody() != null) {
						String fromName = StringUtils.parseName(message
								.getFrom());
						Log.i("XMPPClient", "Got text [" + message.getBody()
								+ "] from [" + fromName + "]");
						messages.add(fromName + ":");
						messages.add(message.getBody());
						if (!MobileTest.isShowing()){
							ns.sendNotify(fromName, message.getBody());
						}
					}
				}
			}, filter);
		}
	}

}
