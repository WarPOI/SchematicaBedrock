const { generateRuntimeId } = require("../datagenerator/gen");

class FakeEntityManager {
  constructor(player) {
    this.player = player;
    this.fakeEntities = {};
    this.renderedEntities = new Set(); 
  }

  fakeBlockEntity(position, block = 1) {
    const entity_id = generateRuntimeId(6) + 69000000;
    let posBlock = {
      x: Math.floor(position.x),
      y: Math.floor(position.y),
      z: Math.floor(position.z),
    };
    this.addFakeEntity(entity_id, posBlock, block);
  }

  addFakeEntity(runtime_id, position, block) {
    const key = `${position.x}_${position.y}_${position.z}`;
    this.fakeEntities[key] = { runtime_id, position, block };
  }

  removeFakeEntity(position) {
    const key = `${position.x}_${position.y}_${position.z}`;
    if (this.fakeEntities[key]) {
      const { runtime_id } = this.fakeEntities[key];
      this.player.queue("remove_entity", {
        entity_id_self: runtime_id,
      });
      delete this.fakeEntities[key];
      this.renderedEntities.delete(runtime_id);
    }
  }

  getEntitiesWithinRadius(centerPosition, radius) {
    const result = [];
    const { x: centerX, y: centerY, z: centerZ } = centerPosition;

    for (const key in this.fakeEntities) {
      const { position, runtime_id, block } = this.fakeEntities[key];
      const dx = position.x - centerX;
      const dy = position.y - centerY;
      const dz = position.z - centerZ;

      const distanceSquared = dx * dx + dy * dy + dz * dz;

      if (distanceSquared <= radius * radius) {
        result.push({ runtime_id, position, block });
      }
    }

    return result;
  }

  renderEntitiesWithinRadius(centerPosition, radius = 5) {
    const visibleEntities = this.getEntitiesWithinRadius(
      centerPosition,
      radius
    );

    visibleEntities.forEach(({ runtime_id, position, block }) => {
      if (!this.renderedEntities.has(runtime_id)) {
        this.fakeAddEntity(runtime_id, position);
        this.fakeMobEquipment(runtime_id, block, -593390456);
        setTimeout(() => {
          this.applyAnimations(runtime_id);
        }, 350);

        this.renderedEntities.add(runtime_id);
      }
    });
    this.renderedEntities.forEach((runtime_id) => {
      const isStillVisible = visibleEntities.some(
        (entity) => entity.runtime_id === runtime_id
      );

      if (!isStillVisible) {
        this.removeEntity(runtime_id)
        this.renderedEntities.delete(runtime_id);
      }
    });
  }

  applyAnimations(runtime_id) {
    const animationList = [
      {
        animation: "animation.player.sleeping",
        stop_condition: "",
        controller: "controller.animation.fox.move",
      },
      {
        animation: "animation.creeper.swelling",
        stop_condition:
          "v.xbasepos=v.xbasepos??0;v.ybasepos=v.ybasepos??0;v.zbasepos=v.zbasepos??0;v.xpos=v.xpos??0;v.ypos=v.ypos??0;v.zpos=v.zpos??0;v.xrot=v.xrot??0;v.yrot=v.yrot??0;v.zrot=v.zrot??0;v.scale=v.scale??0.7;v.xzscale=v.xzscale??0.7;v.yscale=v.yscale??0.7;v.swelling_scale1=2.1385*math.sqrt(v.xzscale)*math.sqrt(v.scale);v.swelling_scale2=2.1385*math.sqrt(v.yscale)*math.sqrt(v.scale);",
        controller: "displayentities:scale",
      },
      {
        animation: "animation.ender_dragon.neck_head_movement",
        stop_condition:
          "v.head_rotation_x=0;v.head_rotation_y=0;v.head_rotation_z=0;v.head_position_x=(v.xbasepos*3741/8000)*math.sqrt(v.xzscale)*math.sqrt(v.scale);v.head_position_y=(10.6925+v.ybasepos*3741/8000)*math.sqrt(v.yscale)*math.sqrt(v.scale);v.head_position_z=(17.108-v.zbasepos*3741/8000)*math.sqrt(v.xzscale)*math.sqrt(v.scale);",
        controller: "displayentities:shift_pos",
      },
      {
        animation: "animation.warden.move",
        stop_condition: "v.body_x_rot=90+v.xrot;v.body_z_rot=90+v.yrot;",
        controller: "displayentities:xrot",
      },
      {
        animation: "animation.player.attack.rotations",
        stop_condition: "v.attack_body_rot_y=-v.zrot;",
        controller: "displayentities:xrot",
      },
      {
        animation: "animation.parrot.moving",
        stop_condition: "v.wing_flap=(16-v.xpos)/0.3;",
        controller: "displayentities:xrot",
      },
      {
        animation: "animation.minecart.move.v1.0",
        stop_condition:
          "v.rail_offset.x=0;v.rail_offset.y=1.6485+v.ypos/16;v.rail_offset.z=0;",
        controller: "displayentities:ypos",
      },
    ];

    animationList.forEach(({ animation, stop_condition, controller }) => {
      this.player.queue("animate_entity", {
        animation,
        next_state: "none",
        stop_condition,
        stop_condition_version: 1,
        controller,
        blend_out_time: 0,
        runtime_entity_ids: [runtime_id],
      });
    });
  }

  fakeAddEntity(runtime_id, position, entity_type = "minecraft:fox") {
    this.player.queue("add_entity", {
      unique_id: runtime_id,
      runtime_id,
      entity_type,
      position: {
        x: position.x + 0.5,
        y: position.y,
        z: position.z + 0.5,
      },
      velocity: { x: 0, y: 0, z: 0 },
      pitch: 0,
      yaw: 0,
      head_yaw: 0,
      body_yaw: 0,
      attributes: [],
      metadata: [
        {
          key: "flags",
          type: "long",
          value: {
            _value: BigInt(844424934850560),
            invisible: true,
          },
        },
        {
          key: "boundingbox_width",
          type: "float",
          value: 0,
        },

        {
          key: "boundingbox_height",
          type: "float",
          value: 0,
        },
      ],
      properties: {
        ints: [],
        floats: [],
      },
      links: [],
    });
  }

  fakeMobEquipment(runtime_entity_id, network_id, block_runtime_id) {
    this.player.queue("mob_equipment", {
      runtime_entity_id,
      item: {
        network_id,
        count: 1,
        metadata: 0,
        has_stack_id: 0,
        block_runtime_id,
        extra: {
          has_nbt: 0,
          can_place_on: [],
          can_destroy: [],
        },
      },
      slot: 0,
      selected_slot: 0,
      window_id: "inventory",
    });
  }
  removeEntity(entity_id_self){
    this.player.queue("remove_entity", {
      entity_id_self,
    });
  }
}

module.exports = FakeEntityManager;
