package com.decoratorpattern;

/**
 * Phase 4: Create a Solid decoration(实体装饰类) for ShapDecorator
 * @param decoratedShape
 */
public class RedShapDecorator extends ShapeDecorator {

	public RedShapDecorator(Shape decoratedShape) {
		super(decoratedShape);
	}

	public void draw(){
		decoratedShape.draw();
		setRedBorder(decoratedShape);
	}
	
	private void setRedBorder(Shape decoratedShape) {
		System.out.println("Border Color:Red");
	}

}
