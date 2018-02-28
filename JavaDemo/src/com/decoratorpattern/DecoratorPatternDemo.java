package com.decoratorpattern;

/**
 * Phase 5: Decorator Shape by RedShapeDecorator.
 * @author sg90
 *
 */
public class DecoratorPatternDemo {
	
	public static void main( String[] args ){
		Shape circle = new Circle();
		Shape redCircle = new RedShapDecorator( new Circle() );
		Shape redRectangle = new RedShapDecorator( new Rectangle() );
		System.out.println("Circle with normal border");
		circle.draw();
		
		System.out.println("\nCircle of red border");
		redCircle.draw();
		
		System.out.println("\nRectangle of red border");
		redRectangle.draw();
	}
}
