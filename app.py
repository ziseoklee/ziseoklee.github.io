import requests

URL = "ziseoklee.github.io/mantra.html"
journalData = {
    'journalTitle' : 'Title',
    'journalPW' : 'Password',
    'amHuman' : '0'
}

session = requests.session()
r = requests.post(URL, data = journalData)

f = open("postValues.txt", "w")
f.write(f"{r.content}")
f.close()