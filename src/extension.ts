import * as vscode from 'vscode';

let intervalId: NodeJS.Timeout | undefined;
let elapsedTime: number = 0;

function secondsToHourFormat(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

function pad(number: number) {
    return number.toString().padStart(2, '0');
}

function startCountingTime() {
	intervalId = setInterval(() => {
		elapsedTime++;
		updateStatusBar();
	}, 1000); // Update the time every 1 second (1000 milliseconds)
}

function stopCountingTime() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
        const formattedTime = secondsToHourFormat(elapsedTime);
        vscode.window.setStatusBarMessage(`Time elapsed: ${formattedTime} seconds`);
		// vscode.window.setStatusBarMessage('Time stopped');
    } else {
		updateStatusBar();
	}
}

function resetTimer() {
    clearInterval(intervalId!); // Clear the interval
    elapsedTime = 0;
    updateStatusBar();
	vscode.window.setStatusBarMessage(`Time elapsed: 00:00:00 seconds`);
}

function updateStatusBar() {
    if (elapsedTime > 0) {
		const formattedTime = secondsToHourFormat(elapsedTime);
        vscode.window.setStatusBarMessage(`Time elapsed: ${formattedTime} seconds`, 1000);
    }
}

export function activate(context: vscode.ExtensionContext) {
    // Create a status bar item
	vscode.window.setStatusBarMessage(`Time elapsed: 00:00:00 seconds`);
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const resetTime = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.text = "$(clock) Start Timer";
    statusBarItem.tooltip = "Start the timer";
	
    // Register a command to start and stop the timer
    const startStopCommand = 'extension.startStopTimer';
    context.subscriptions.push(
        vscode.commands.registerCommand(startStopCommand, () => {
            if (!intervalId) {
                startCountingTime();
                statusBarItem.text = "$(primitive-square) Stop Timer";
                statusBarItem.tooltip = "Stop the timer";
				resetTime.text = "$(refresh) Reset Timer";
                resetTime.tooltip = "Reset the timer";
            } else {
                stopCountingTime();
                statusBarItem.text = "$(clock) Start Timer";
                statusBarItem.tooltip = "Start the timer";
            }
        })
    );

	const resetTimeCommand = 'extension.resetTimeCommand';
	context.subscriptions.push(
        vscode.commands.registerCommand(resetTimeCommand, () => {
			if (intervalId) {
                resetTimer();
                statusBarItem.text = "$(clock) Start Timer";
                statusBarItem.tooltip = "Start the timer";
            } else {
                resetTimer();
            }
        })
    );

    // Set the command for the status bar item
    statusBarItem.command = startStopCommand;
    resetTime.command = resetTimeCommand;

    // Show the status bar item
    statusBarItem.show();
    resetTime.show();

    // Add the status bar item to the subscriptions
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(resetTime);
}

export function deactivate() {
    // Deactivation logic if needed
}