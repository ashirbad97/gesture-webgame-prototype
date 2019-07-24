#!/usr/bin/env python3
import json
import paho.mqtt.client as mqtt
import pyautogui
pyautogui.FAILSAFE = True
# This is the Subscriber

def on_connect(client, userdata, flags, rc):
  print("Connected with result code "+str(rc))
  client.subscribe("game")

def on_message(client, userdata, msg):
	print(msg.payload.decode())
	payload = msg.payload.decode()
	payload1 = json.loads(payload)
	print(payload1[0])
	pyautogui.moveTo(payload1[0], payload1[1], duration=0.01)
       # client.disconnect()     
    
client = mqtt.Client()
client.connect("localhost",1883,60)

client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()