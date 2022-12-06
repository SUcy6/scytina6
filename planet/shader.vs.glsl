precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute vec3 vertNormal;
attribute vec3 vertPosition2;
// attribute vec2 vertTexCoord2;
// attribute vec3 vertNormal2;

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

uniform float happy_w;

void main()
{

  // // if other weights add up to less than 1, use neutral target
  // float neutral_w = 1.0 - happy_w - angry_w;
  // clamp (neutral_w, 0.0, 1.0);

  // // get a sum of weights and work out factors for each target
  // float sum_w = happy_w + angry_w + neutral_w;
  // float happy_f = happy_w / sum_w;
  // float angry_f = angry_w / sum_w;
  // float neutral_f = neutral_w / sum_w;

  // interpolate targets to give us current pose
  vec3 pos = 1.0 * vertPosition2 + 0.0 * vertPosition;


  fragTexCoord = vertTexCoord;
  fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;

  gl_Position = mProj * mView * mWorld * vec4(pos, 1.0);
}

