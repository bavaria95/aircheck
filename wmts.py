from __future__ import (absolute_import, division, print_function)
from owslib.wmts import WebMapTileService
from math import *
import owslib.wmts

wmts = WebMapTileService("http://map1c.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi")

print(wmts.identification.type)
print(wmts.identification.version)

print(wmts.identification.title)

#print(str.strip(wmts.identification.abstract))

print(wmts.identification.keywords)


print(wmts.provider.name)

print(wmts.provider.url)


print (len(wmts.contents.keys()) > 0)

print( sorted(list(wmts.contents))[0])

# iks, igrek = (8421281.093346566, 3375105.7843203144)

def convertDegrees(lat, lon):
    return (90 - lat, 180 + lon)

iks, igrek = convertDegrees(-33.866667, 151.2)

# iks, igrek = (90+ (-54.611667), 180 +  18.808056)
# iks, igrek = (40.7127,180 + -74.0059)

le_z = 6

divider = ((0.5625 * 512)/ pow(2,le_z));

le_x = int(floor(iks/divider))
le_y = int(floor(igrek/divider))

print(le_x, le_y)



tile = wmts.gettile(layer='MODIS_Terra_CorrectedReflectance_TrueColor', tilematrixset='EPSG4326_250m', tilematrix=le_z, row=le_x, column=le_y, format="image/jpeg", time="2016-04-22")
#tile = wmts.gettile(layer='VIIRS_CityLights_2012', tilematrixset='EPSG4326_500m', tilematrix=le_z, row=le_x, column=le_y, format="image/jpeg")
out = open('nasa_modis_terra_truecolour.jpg', 'wb')
bytes_written = out.write(tile.read())
out.close()


wmts = WebMapTileService('http://data.geus.dk/arcgis/rest/services/OneGeologyGlobal/S071_G2500_OneGeology/MapServer/WMTS/1.0.0/WMTSCapabilities.xml')
