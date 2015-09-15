/*
 * (C) 2015 Seth Lakowske
 */

var test    = require('tape');
var obscene = require('./');

test('can rotate', function(t) {

    var rotated = obscene.rotate([1, 0, 0], 45 * (Math.PI / 180) );

    console.log(rotated);

    t.end();
})

test('can translate', function(t) {

    var translated = obscene.translate([2, 2, 2]);

    console.log(translated);

    t.end();
})

test('can combine', function(t) {

    var translated = obscene.translate([0, 0, 2]);

    var rotated = obscene.rotate([1, 0, 0], 90 * (Math.PI / 180) );

    var combined  = obscene.combine(rotated, translated);

    console.log(combined);

    t.end();
    
})
