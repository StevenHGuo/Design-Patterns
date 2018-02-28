package com.adapterpattern;

public class AdapterPattern {

	public static void main( String[] args ){
		Target mAdapter = new Adapter();
		mAdapter.Request();
	}
	
}
