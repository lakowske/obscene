# Obscene
A minimal scene graph library.

# Constructable

```
//Creates a scene node at the origin with no rotation
var origin = obscene.origin();

//Creates a scene node translated forward 1 unit
var forward = obscene.translate([1, 0, 0]);

//Creates a scene node rotated about the right vector 45 degrees
var rotated = obscene.rotate([0, 1, 0], Math.radians(45))

```

# Combinable

```
//Combine two scene nodes and return the merged result
var combined = obscene.combine(parent, child)
```

# Composable
```

var childSceneNode = addChild(parent, sceneNode);

```

# Persistable to a database
```

dbutil.insert(sceneNode, sceneNodeFields, 'scenenodes', dbclient, function(err, result) {

   if (err) {console.error(err); return;}

   //sceneNode is now persisted
})

```

