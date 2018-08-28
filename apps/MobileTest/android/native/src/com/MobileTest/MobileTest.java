package com.MobileTest;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.os.Bundle;

import org.apache.cordova.CordovaActivity;

import com.worklight.androidgap.api.WL;
import com.worklight.androidgap.api.WLInitWebFrameworkResult;
import com.worklight.androidgap.api.WLInitWebFrameworkListener;

public class MobileTest extends CordovaActivity implements WLInitWebFrameworkListener {
	
	private static boolean isResumed = false;

	@Override
	public void onPause() {
	  super.onPause();    
	  isResumed = false;
	}

	@Override
	public void onResume() {
	  super.onResume();    
	  isResumed = true;
	}
	
	public static boolean isShowing(){
		return isResumed;
	}
	
	@Override
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);

		WL.createInstance(this);

		WL.getInstance().showSplashScreen(this);

		WL.getInstance().initializeWebFramework(getApplicationContext(), this);
		
	}

	/**
	 * The IBM MobileFirst Platform calls this method after its initialization is complete and web resources are ready to be used.
	 */
 	public void onInitWebFrameworkComplete(WLInitWebFrameworkResult result){
		if (result.getStatusCode() == WLInitWebFrameworkResult.SUCCESS) {
			super.loadUrl(WL.getInstance().getMainHtmlFilePath());
		} else {
			handleWebFrameworkInitFailure(result);
		}
	}

	private void handleWebFrameworkInitFailure(WLInitWebFrameworkResult result){
		AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
		alertDialogBuilder.setNegativeButton(R.string.close, new OnClickListener() {
			@Override
			public void onClick(DialogInterface dialog, int which){
				finish();
			}
		});

		alertDialogBuilder.setTitle(R.string.error);
		alertDialogBuilder.setMessage(result.getMessage());
		alertDialogBuilder.setCancelable(false).create().show();
	}
}
