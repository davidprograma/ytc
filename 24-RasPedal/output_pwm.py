try:
    import RPi.GPIO as GPIO
except RuntimeError:
    print("Error importing RPi.GPIO!")
    print("You need superuser privileges")
    print("Use 'sudo' to run your script")
    exit()

from time import sleep

GPIO.setmode(GPIO.BOARD)

# setup output channel
output_channel = 5
output_frequency = 8000
output_duty_cycle = 0.0   # 0.0 to 100.0

GPIO.setup(output_channel, GPIO.OUT)
pwm = GPIO.PWM(output_channel, output_frequency)
pwm.start(output_duty_cycle)

try:
    while True:
        sleep(0.1)
except KeyboardInterrupt:
    pass

print()
print("interrupted, cleaning up")

pwm.stop()

GPIO.cleanup()

import sys
sys.exit()
