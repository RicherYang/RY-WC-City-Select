=== RY WC City Select ===
Contributors: fantasyworld
Donate link: https://www.paypal.me/RicherYang
Tags: woocommerce, city, select, dropdown
Requires at least: 5.6
Requires PHP: 7.4
Tested up to: 5.9
Stable tag: 1.1.0
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

* PHP 7.4+
* WordPress 5.6+
* WooCommerce 5.0+


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

= All cities list from http://geonames.org/  =
From the [RY-WC-City-Select-cities-files](https://github.com/sergioxdev/RY-WC-City-Select-cities-files)
You can add almost main states and cities list in the world.
But some state or city may use different name with the official name.

To enable geonames.org data, add code into you theme functions.php.
Or use Code Snippets[https://wordpress.org/plugins/code-snippets/] to add code.

`
add_filter('ry_wei_load_geonames_org', '__return_true');
`


== Changelog ==

= 1.1.0 - 2022/04/04 =
* postal code clear with selected no postal code city ([issuu #6](https://github.com/RicherYang/RY-WC-City-Select/issues/6))
* change form field html style more like woocommerce

= 1.0.15 - 2022/03/29 =
* change city zip code to string

= 1.0.14 - 2022/02/05 =
* change website link

= 1.0.13 - 2022/01/02 =
* fix when empty city get error info

= 1.0.12 - 2022/01/02 =
* change PHP minimum requirement to 7.4

= 1.0.11 - 2021/12/27 =
* update minimum requirements

= 1.0.10 - 2020/12/09 =
* checked support new verison

= 1.0.9 - 2020/04/21 =
* fix some theme error.

= 1.0.8 - 2020/04/06 =
* add geonames.org data in plugin.

= 1.0.7 - 2020/03/14 =
* add info in readme.txt

= 1.0.6 - 2020/03/14 =
* add Kuwait states and cities. (thx [Ahmed Safaa](https://github.com/Mello21century))

= 1.0.5 - 2020/03/12 =
* update Support WooCommerce 4

= 1.0.4 - 2020/02/15 =
* update WooCommerce tested version

= 1.0.3 - 2019/12/10 =
* fix checkout page city select change error

= 1.0.2 - 2019/12/10 =
* fix Tanwan city i10n error

= 1.0.1 - 2019/12/09 =
* fix Tanwan state and city list error

= 1.0.0 - 2019/12/07 =
* First release
