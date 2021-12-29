try:
    import RPi.GPIO as GPIO
except RuntimeError:
    print("error importing RPi.GPIO!")
    print("probably you need superuser privileges.")
    print("use 'sudo' to run your script")
    exit()

from time import sleep

GPIO.setmode(GPIO.BOARD)

# setup input channel
input_channel = 7
GPIO.setup(input_channel, GPIO.IN)

print("detecting reed input from GPIO {}".format(input_channel))

count = 0

# edge detection callback
def process_input_edge(channel):
    global count
    print('reed edge detected - count = {}'.format(count))
    count += 1

# setup edge detection
GPIO.add_event_detect(input_channel, GPIO.RISING, callback=process_input_edge)

try:
    while True:
        sleep(0.1)
except KeyboardInterrupt:
    pass

print()
print("interrupted, cleaning up")

GPIO.remove_event_detect(input_channel)

import sys
sys.exit()
print("exiting...")
