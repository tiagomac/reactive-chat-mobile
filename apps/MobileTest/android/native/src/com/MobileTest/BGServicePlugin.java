/**
 * COPYRIGHT LICENSE: This information contains sample code provided in source code form. You may copy, modify, and distribute
 * these sample programs in any form without payment to IBM® for the purposes of developing, using, marketing or distributing
 * application programs conforming to the application programming interface for the operating platform for which the sample code is written.
 * Notwithstanding anything to the contrary, IBM PROVIDES THE SAMPLE SOURCE CODE ON AN "AS IS" BASIS AND IBM DISCLAIMS ALL WARRANTIES,
 * EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, SATISFACTORY QUALITY,
 * FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND ANY WARRANTY OR CONDITION OF NON-INFRINGEMENT. IBM SHALL NOT BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR OPERATION OF THE SAMPLE SOURCE CODE.
 * IBM HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS OR MODIFICATIONS TO THE SAMPLE SOURCE CODE.
 */

package com.MobileTest;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;

import com.MobileTest.NotificationService;

public class BGServicePlugin extends CordovaPlugin {
	
	@Override
	public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) 
			throws JSONException {
		if (action.equals("startService")){
			try {
				final String responseText = args.getString(0);
				Intent i = new Intent(this.cordova.getActivity(), NotificationService.class);
				i.putExtra("login", args.getString(0));
				this.cordova.getActivity().startService(i);
				cordova.getThreadPool().execute(new Runnable() {
					public void run() {	        	
						callbackContext.success(responseText); // Thread-safe.
					}
				});
			} catch (JSONException e){
				callbackContext.error("Failed to parse parameters");
			}
			return true;
	    }
		return false;
	}
}
