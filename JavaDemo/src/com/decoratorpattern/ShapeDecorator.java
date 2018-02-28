package com.decoratorpattern;

/**
 * Phase 3 : Create an abstract decorator class that implements the interface about Shape.
 * @author sg90
 *
 */
public abstract class ShapeDecorator implements Shape {

	protected Shape decoratedShape;
	
	public ShapeDecorator( Shape decoratedShape ){
		this.decoratedShape = decoratedShape;
	}
	
	@Override
	public void draw() {
		decoratedShape.draw();
	}
	
}
