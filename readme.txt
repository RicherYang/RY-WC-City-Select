=== RY City Select for WooCommerce ===
Contributors: fantasyworld
Donate link: https://www.paypal.me/RicherYang
Tags: woocommerce, city, select, dropdown
Requires at least: 6.3
Requires PHP: 8.0
Tested up to: 6.4
Stable tag: 2.1.0
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.txt

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
            ['City', '100'],
            ['Another City', '101']
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

* PHP 8.0+
* WordPress 6.3+
* WooCommerce 8.0+


== Frequently Asked Questions ==

= Where can I contribute the cities list of my country? =
Please use [GitHub repository](https://github.com/RicherYang/RY-WC-City-Select).
Use issuu give me the list, or use pull requests the file change.

If your country don't have states list in woocommerce (see file /woocommerce/i18n/states.php).
You also need contribute the states list.

The sample file is cities/TW.php and states/TW.php

= Where can I report bugs or contribute to the project? =
Report bugs on the [GitHub repository](https://github.com/RicherYang/RY-WC-City-Select/issues),
or my [person website page](https://ry-plugin.com/ry-wc-city-select).

= All cities list from http://geonames.org/ =
From the [RY-WC-City-Select-cities-files](https://github.com/sergioxdev/RY-WC-City-Select-cities-files)
You can add almost main states and cities list in the world.
But some state or city may use different name with the official name.

To enable geonames.org data, add code into you theme functions.php.
Or use Code Snippets[https://wordpress.org/plugins/code-snippets/] to add code.

`
add_filter('ry_wcs_load_geonames_org', '__return_true');
`


== Changelog ==

= 2.1.0 - 2024/03/022 =
* CHANGE Plugin name.

= 2.0.1 - 2023/08/26 =
* Fixed change city maynot edit the zip code.

= 2.0.0 - 2023/04/23 =
* CHANGE License to GPLv3.

= 1.1.3.1 - 2023/03/30 =
* Change WordPress croe tested version info.

= 1.1.3 - 2023/02/13 =
* Change main class name.

= 1.1.2 - 2022/07/16 =
* Change plugin info.

= 1.1.1 - 2022/06-03 =
* add Romanian cities. (by condor2)

= 1.1.0 - 2022/04/04 =
* postal code clear with selected no postal code city ([issuu #6](https://github.com/RicherYang/RY-WC-City-Select/issues/6))
* change form field html style more like woocommerce

= 1.0.0 - 2019/12/07 =
* First release
