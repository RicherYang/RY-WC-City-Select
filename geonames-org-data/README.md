
RY-WC-City-Select-cities-files

Addons Plugin Wordpress
Files of all states and cities for RY-WC-City-Select

Data from: http://geonames.org/


------------------------------------------------------------------
In order to add or update city and state files,
just copy and overwrite the files in the folders respectively

cities  -->  wp-content/plugins/ry-wc-city-select/cities

states  -->  wp-content/plugins/ry-wc-city-select/states

Clear the cache, and it's all working


------------------------------------------------------------------
some wordpress cache optimization plugins,

they could cause a loading problem, returning a blank page, without generating an error, in this case

you can try adding the code below on your wp-config.php to increase the limit.

ini_set('pcre.backtrack_limit', '4000000');


------------------------------------------------------------------
Data updated to 2020-03-24

