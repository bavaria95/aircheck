#Lists all symptoms that can be caused by CO levels higher than 70 ppm
def causedByCO(symptom):
	symptoms = [
	"headache",
	"fatigue",
	"shortness of breath",
	"nausea",
	"dizziness",
	"mental confusion",
	"vomiting",
	"loss of muscular coordination",
	"loss of consciousness",
	"death"]

	return symptoms.count(symptom.lower()) != 0

#Lists only the symptoms that are caused by CO levels above 150 ppm
def causedByHighLevelsOfCO(symptom):
	symptoms = [
	"mental confusion",
	"vomiting",
	"loss of muscular coordination",
	"loss of consciousness",
	"death"]
	return symptoms.count(symptom.lower()) != 0

#Lists all symptoms caused by SO2 levels above 0.25 ppm
def causedBySO2(symptom):
	symptoms = [
	"asthma",
	"bronchospasm",
	"pneumonitis",
	"pulmonary edema",
	"chronic cardiopulmonary disease",
	"reactive airway dysfunction syndrome (rads)",
	"irritated skin",
	"nausea",
	"vomiting",
	"abdominal pain",
	"sneezing",
	"sore throat",
	"wheezing",
	"shortness of breath",
	"chest tightness",
	"feeling of suffocation",
	"death"
	]

	return symptoms.count(symptom.lower()) != 0


#Concentration in ppm (parts per million)
HIGH_CO_CONCENTRATION = 150.0
HIGH_SO2_CONCENTRATION = 10.0

def getGasFromSymptom(symptom, COLevel, SO2Level):
	listOfCausingGases = []
	sulfurDioxide = causedBySO2(symptom)
	carbonMonoxide = causedByCO(symptom)
	if carbonMonoxide and causedByHighLevelsOfCO(symptom) and COLevel >= HIGH_CO_CONCENTRATION:
		listOfCausingGases.append("Carbon Monoxide")

	#TODO: Finish this function by adding logic for SO2
	return listOfCausingGases



