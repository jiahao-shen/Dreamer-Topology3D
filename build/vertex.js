if (typeof dreamer === 'undefined') {
    var dreamer = {};
}

dreamer.Vertex = (function (global) {
    'use strict';
    // Constructor
    function Vertex(nodes, pos, label, node_properties) {
        this.pos = pos ? Point(pos.x, pos.y) : Point();
        this.v = Point();
        if (node_properties)
            this.vertex_info = node_properties;
        else
            this.vertex_info = new Vertex_info("", false);

        this.label = label || next_label(nodes);
    }

    Vertex.prototype.node_loop_angle = function () {
        var angles = [],
            angle = 0,
            i, diff, bestdiff = 0,
            edge, npos, thispos = this.pos,
            neighbors_list = neighbors_of(this);
        angles = neighbors_list.map(function (node) {
            var npos = node.get_pos();
            return Math.atan2(-npos.y + thispos.y, npos.x - thispos.x);
        });
        angles.sort(sort_num);
        for (i = 0; i < angles.length - 1; i += 1) {
            diff = angles[i + 1] - angles[i];
            if (diff > bestdiff) {
                angle = angles[i] + diff / 2;
                bestdiff = diff;
            }
        }
        diff = Math.PI * 2 + angles[0] - angles[angles.length - 1];
        if (diff > bestdiff) {
            angle = angles[angles.length - 1] + diff / 2;
        }
        return angle;
    };

    Vertex.prototype.vector_from = function (v) {
        return {
            x: this.pos.x - v.x,
            y: this.pos.y - v.y
        };
    };
    Vertex.prototype.change_vel = function (deltax, deltay) {
        if (!this.vertex_info.frozen) {
            this.v.x += deltax;
            this.v.y += deltay;
        }
    };
    Vertex.prototype.get_pos = function () {
        return this.pos;
    };
    Vertex.prototype.set_pos = function (new_pos) {
        this.pos = new_pos;
    };
    Vertex.prototype.toggle_freeze = function () {
        this.vertex_info.frozen = !this.vertex_info.frozen;
    };
    Vertex.prototype.get_frozen = function () {
        return this.vertex_info.frozen;
    };
    Vertex.prototype.run = function () {
        this.pos.x += Math.min(Math.max(SPEED * this.v.x, -20), 20);
        this.pos.y += Math.min(Math.max(SPEED * this.v.y, -20), 20);
        this.v.x *= 0.5;
        this.v.y *= 0.5;
    };

    var Vertex_info = function (loopback, frozen) {
        this.frozen = frozen;
        this.loopback = loopback;
    };


    return Vertex;

}(this));

if (typeof module === 'object') {
    module.exports = dreamer.Vertex;
}