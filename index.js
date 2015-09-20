/*
 * (C) 2015 Seth Lakowske
 */

var objectly = require('objectly');
var mat4     = require('gl-mat4');

module.exports.nodeFields = [
    {name : 'id', type: 'text', predicate : 'primary key'},
    {name : 'name', type: 'text'},
    {name : 'parent', type: 'text'},
    {name : 'localmatrix', type : 'float(53)[4][4]'},
    {name : 'localvectors', type : 'float(53)[4][4]'}
]

/*
 * Origin node used for operations (Read only).
 */
var singleton = origin();

/*
 * Return a scene node at the origin.
 */
function origin() {

    var o = objectly.getObject(module.exports.nodeFields);

    //Set w to 1
    setW(o.localvectors);

    return o;
}

/*
 * Return the position along the x axis.
 */
function getX(sceneNode) {

    return sceneNode.localmatrix[12];
    
}

/*
 * Return the position along the y axis.
 */
function getY(sceneNode) {

    return sceneNode.localmatrix[13];
    
}

/*
 * Return the position along the z axis.
 */
function getZ(sceneNode) {

    return sceneNode.localmatrix[14];
    
}

/*
 * Return the right vector.
 */
function getRight(sceneNode) {

    var right = [sceneNode.localvectors[0], sceneNode.localvectors[1], sceneNode.localvectors[2]];

    return right;
    
}

/*
 * Return the up vector.  Here we use the y axis for up because opengl's coordinate system
 * specifies up as y in the clip space.  The identity matrix's second row points along the y
 * axis, so return the second row.
 */
function getUp(sceneNode) {

    var up = [sceneNode.localvectors[4], sceneNode.localvectors[5], sceneNode.localvectors[6]];

    return up;

}

/*
 * Return the forward vector.
 */
function getForward(sceneNode) {

    var forward = [sceneNode.localvectors[8], sceneNode.localvectors[9], sceneNode.localvectors[10]];

    return forward;
    
}

function setW(localvectors) {
    //Set w to 1
    localvectors[3] = 1;
    localvectors[7] = 1;
    localvectors[11] = 1;
    localvectors[15] = 1;

    return localvectors;
}

/*
 * Return a scene node translated by vector.
 */
function translate(vector) {

    var o = origin();
    
    mat4.translate(o.localmatrix, o.localmatrix, vector);
    
    return o;
    
}

/*
 * Return a scene node rotated about the axis the given number of radians.
 */
function rotate(axis, radians) {

    var o = origin();

    mat4.rotate(o.localmatrix, o.localmatrix, radians, axis);

    mat4.multiply(o.localvectors, o.localvectors, o.localmatrix);

    setW(o.localvectors);
    
    return o;

}

/*
 * Return a scene node rotated about up.
 */
function aboutUp(radians) {

    return rotate(getUp(singleton), radians);
    
}

/*
 * Return a scene node rotated about right.
 */
function aboutRight(radians) {

    return rotate(getRight(singleton), radians);
    
}

/*
 * Return a scene node rotated about forward.
 */
function aboutForward(radians) {

    return rotate(getForward(singleton), radians);

}

/*
 * Return the combination of two scene nodes as a single scene node.
 * In otherwords, collapse the parent/child relationship into one worldview.
 * If repeatedly applied starting at the root and ending at the leafs, you get the world view at
 * the leaf.
 */
function combine(parent, child) {

    var o = origin();

    mat4.multiply(o.localmatrix, parent.localmatrix, child.localmatrix);

    mat4.multiply(o.localvectors, o.localvectors, o.localmatrix);

    setW(o.localvectors);

    return o;
}

function makePerspective(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
    ];
};

/*
 * Create a camera node.  This node is a perspective transformation.
 */
function perspectiveCamera(fieldOfViewInRadians, aspect, near, far) {

    var o = origin();

    o.localmatrix = makePerspective(fieldOfViewInRadians, aspect, near, far);

    setW(o.localvectors);
    
    return o;
}

module.exports.origin            = origin;
module.exports.rotate            = rotate;
module.exports.translate         = translate;
module.exports.combine           = combine;
module.exports.aboutUp           = aboutUp;
module.exports.aboutRight        = aboutRight;
module.exports.aboutForward      = aboutForward;
module.exports.getUp             = getUp;
module.exports.getForward        = getForward;
module.exports.getRight          = getRight;
module.exports.getX              = getX;
module.exports.getY              = getY;
module.exports.getZ              = getZ;
module.exports.perspectiveCamera = perspectiveCamera;
