var π = Math.PI,
    τ = 2 * π,
    halfπ = π / 2,
    ε = 1e-6,
    __radians = π / 180,
    __degrees = 180 / π;
function __asin(x) {
    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
}

function __identity(d) {
    return d;
}
rebind = function(target, source) {
    var i = 1,
        n = arguments.length,
        method;
    while (++i < n) target[method = arguments[i]] = _rebind(target, source, source[method]);
    return target;
};
function _rebind(target, source, method) {
    return function() {
        var value = method.apply(source, arguments);
        return value === source ? target : value;
    };
}
function __true() {
    return true;
}
var abs = Math.abs;
function noop() {}
function __geo_clip(pointVisible) {
    return function(rotate, listener) {
        var clip = {
            point: point
        };

        function point(λ, φ) {
            var point = rotate(λ, φ);
            if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);
        }
        return clip;
    };
}
var __geo_clipAntimeridian = __geo_clip(__true);
function __geo_rotation(δλ, δφ, δγ) {
    return __geo_rotationλ(δλ);
}
function __geo_forwardRotationλ(δλ) {
    return function(λ, φ) {
        return λ += δλ, [λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ];
    };
}
function __geo_rotationλ(δλ) {
    var rotation = __geo_forwardRotationλ(δλ);
    rotation.invert = __geo_forwardRotationλ(-δλ);
    return rotation;
}


function __geo_clipExtent(x0, y0, x1, y1) {
    return function(listener) {
        var clip = {
            point: point
        };

        function pointVisible(x, y) {
            return x0 <= x && x <= x1 && y0 <= y && y <= y1;
        }

        function point(x, y) {
            if (pointVisible(x, y)) listener.point(x, y);
        }
        return clip;
    };
}

function __geo_compose(a, b) {
    function compose(x, y) {
        return x = a(x, y), b(x[0], x[1]);
    }
    if (a.invert && b.invert) compose.invert = function(x, y) {
        return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    };
    return compose;
}
USProjection = function() {
    var lower48 = Lower48();
    var alaska = conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]);
    var hawaii = conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]);
    var point, pointStream = {
            point: function(x, y) {
                point = [x, y];
            }
        },
        lower48Point, alaskaPoint, hawaiiPoint;

    function albersUsa(coordinates) {
        var x = coordinates[0],
            y = coordinates[1];
        point = null;
        (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
        return point;
    }
    albersUsa.invert = function(coordinates) {
        var k = lower48.scale(),
            t = lower48.translate(),
            x = (coordinates[0] - t[0]) / k,
            y = (coordinates[1] - t[1]) / k;
        return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);
    };
    albersUsa.stream = function(stream) {
        return {};
    };
    albersUsa.scale = function(_) {
        if (!arguments.length) return lower48.scale();
        lower48.scale(_);
        alaska.scale(_ * .35);
        hawaii.scale(_);
        return albersUsa.translate(lower48.translate());
    };
    albersUsa.translate = function(_) {
        if (!arguments.length) return lower48.translate();
        var k = lower48.scale(),
            x = +_[0],
            y = +_[1];
        lower48Point = lower48.translate(_).clipExtent([
            [x - .455 * k, y - .238 * k],
            [x + .455 * k, y + .238 * k]
        ]).stream(pointStream).point;
        alaskaPoint = alaska.translate([x - .307 * k, y + .201 * k]).clipExtent([
            [x - .425 * k + ε, y + .12 * k + ε],
            [x - .214 * k - ε, y + .234 * k - ε]
        ]).stream(pointStream).point;
        hawaiiPoint = hawaii.translate([x - .205 * k, y + .212 * k]).clipExtent([
            [x - .214 * k + ε, y + .166 * k + ε],
            [x - .115 * k - ε, y + .234 * k - ε]
        ]).stream(pointStream).point;
        return albersUsa;
    };
    return albersUsa.scale(1070);
};

function __geo_resample(project) {

    function resample(stream) {
        return (resampleRecursive)(stream);
    }

    function resampleRecursive(stream) {
        var resample = {
            point: point
        };

        function point(x, y) {
            x = project(x, y);
            stream.point(x[0], x[1]);
        }
        return resample;
    }
    return resample;
}

function __geo_transformPoint(stream, point) {
    return {
        point: point
    };
}
function __geo_projectionMutator(projectAt) {
    var project, rotate, projectRotate, projectResample = __geo_resample(function(x, y) {
            x = project(x, y);
            return [x[0] * k + δx, δy - x[1] * k];
        }),
        k = 150,
        x = 480,
        y = 250,
        λ = 0,
        φ = 0,
        δλ = 0,
        δφ = 0,
        δγ = 0,
        δx, δy, preclip = __geo_clipAntimeridian,
        postclip = __identity,
        clipAngle = null,
        clipExtent = null,
        stream;

    function projection(point) {
        point = projectRotate(point[0] * __radians, point[1] * __radians);
        return [point[0] * k + δx, δy - point[1] * k];
    }

    function invert(point) {
        point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);
        return point && [point[0] * __degrees, point[1] * __degrees];
    }
    projection.stream = function(output) {
        if (stream) stream.valid = false;
        stream = __geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));
        stream.valid = true;
        return stream;
    };
    projection.clipExtent = function(_) {
        if (!arguments.length) return clipExtent;
        clipExtent = _;
        postclip = _ ? __geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : __identity;
        return invalidate();
    };
    projection.scale = function(_) {
        if (!arguments.length) return k;
        k = +_;
        return reset();
    };
    projection.translate = function(_) {
        if (!arguments.length) return [x, y];
        x = +_[0];
        y = +_[1];
        return reset();
    };
    projection.center = function(_) {
        if (!arguments.length) return [λ * __degrees, φ * __degrees];
        λ = _[0] % 360 * __radians;
        φ = _[1] % 360 * __radians;
        return reset();
    };
    projection.rotate = function(_) {
        if (!arguments.length) return [δλ * __degrees, δφ * __degrees, δγ * __degrees];
        δλ = _[0] % 360 * __radians;
        δφ = _[1] % 360 * __radians;
        δγ = _.length > 2 ? _[2] % 360 * __radians : 0;
        return reset();
    };
    rebind(projection, projectResample, "precision");

    function reset() {
        projectRotate = __geo_compose(rotate = __geo_rotation(δλ, δφ, δγ), project);
        var center = project(λ, φ);
        δx = x - center[0] * k;
        δy = y + center[1] * k;
        return invalidate();
    }

    function invalidate() {
        if (stream) stream.valid = false, stream = null;
        return projection;
    }
    return function() {
        project = projectAt.apply(this, arguments);
        projection.invert = project.invert && invert;
        return reset();
    };
}
function __geo_projectionRadians(stream) {
    return __geo_transformPoint(stream, function(x, y) {
        stream.point(x * __radians, y * __radians);
    });
}
function __geo_conic(projectAt) {
    var φ0 = 0,
        φ1 = π / 3,
        m = __geo_projectionMutator(projectAt),
        p = m(φ0, φ1);
    p.parallels = function(_) {
        if (!arguments.length) return [φ0 / π * 180, φ1 / π * 180];
        return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
    };
    return p;
}
function __geo_conicEqualArea(φ0, φ1) {
    var sinφ0 = Math.sin(φ0),
        n = (sinφ0 + Math.sin(φ1)) / 2,
        C = 1 + sinφ0 * (2 * n - sinφ0),
        ρ0 = Math.sqrt(C) / n;

    function forward(λ, φ) {
        var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
        return [ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ)];
    }
    forward.invert = function(x, y) {
        var ρ0_y = ρ0 - y;
        return [Math.atan2(x, ρ0_y) / n, __asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n))];
    };
    return forward;
}
var conicEqualArea = function() {
    return __geo_conic(__geo_conicEqualArea);
}
conicEqualArea.raw = __geo_conicEqualArea;
var Lower48 = function() {
    return conicEqualArea().rotate([96, 0]).center([-.6, 38.7]).parallels([29.5, 45.5]).scale(1070);
};
var NXprojection = USProjection();