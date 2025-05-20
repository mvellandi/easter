export type ControllerButton = 'up' | 'down' | 'left' | 'right' | 'a' | 'b' | 'start' | 'select';
export type ButtonPressHandler = (button: ControllerButton) => void; 