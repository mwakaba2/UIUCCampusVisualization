from firebase import firebase
from pprint import pprint

import json


def retrieve_data(show_data):
	firebaseGet = firebase.FirebaseApplication('https://campusspace.firebaseio.com/', None)
	results = firebaseGet.get('', None)

	print "No of result:", len(results)
	# print results
	# read_lines = 100
	if show_data:
		for key in results:
			pprint(results[key])

	return results

def main():
	fout = open("./data/retrieved_data.json", 'w+')
	jdata = retrieve_data(show_data = False)
	json.dump(jdata, fout)

main()
