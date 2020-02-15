=== RY WC City Select ===
Contributors: fantasyworld
Donate link: https://www.paypal.me/RicherYang
Tags: woocommerce, city, select, dropdown
Requires at least: 5.0
Requires PHP: 5.6.20
Tested up to: 5.3.0
Stable tag: 1.0.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.txt

Show a dropdown select as the cities input on WooCommerce. Auto set the postcode for selected city.

== Description ==

This plubin is based on [WC City Select](https://tw.wordpress.org/plugins/wc-city-select/)

WooCommerce uses a text input for the customers to enter the city or town.
With this plugin you can provide a list of cities to be shown as a select dropdown.

This will be shown in checkout pages, edit addresses pages and shipping calculator if it's configured that way.

After selected the city or town, auto set the postcode number if is defined.

### How to add cities

A list of cities can be added in your theme functions.php file.

Use `ry_wc_city_select_cities` filter to load your cities.
This is done similarly to [Add/Modify States](https://docs.woocommerce.com/document/addmodify-states/).
It should be added on your functions.php or a custom plugin.

`
add_filter( 'ry_wc_city_select_cities', 'my_cities' );
/**
 * Replace XX with the country code. Instead of YYY, ZZZ use actual state codes.
 * The City list can list of city name with postcode or just city name.
 */
function my_cities( $cities ) {
	$cities['XX'] = array(
		'YYY' => array( // city name with postcoe
			['City', 100],
			['Another City', 101]
		),
		'ZZZ' => array( // just city name
			'City 3',
			'City 4'
		)
	);
	return $cities;
}
`

== Installation ==

= Minimum Requirements =

* PHP 5.6.20+
* WordPress 5.0+
* WooCommerce 3.0+


== Frequently Asked Questions ==

= Where can I contribute the cities list of my country? =
Please use [GitHub repository](https://github.com/RicherYang/RY-WC-City-Select).
Use issuu give me the list, or use pull requests the file change.

If your country don't have states list in woocommerce (see file /woocommerce/i18n/states.php).
You also need contribute the states list.

The sample file is cities/TW.php and states/TW.php

= Where can I report bugs or contribute to the project? =
Report bugs on the [GitHub repository](https://github.com/RicherYang/RY-WC-City-Select/issues),
or my [person website page](https://richer.tw/ry-wc-city-select/).


== Changelog ==

= 1.0.4 - 2020/02/15 =
* update WooCommerce tested version.

= 1.0.3 - 2019/12/10 =
* fix checkout page city select change error.

= 1.0.2 - 2019/12/10 =
* fix Tanwan city i10n error.

= 1.0.1 - 2019/12/09 =
* fix Tanwan state and city list error.

= 1.0.0 - 2019/12/07 =
* First release.
