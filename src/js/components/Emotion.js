/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react'
import classnames  from 'classnames';






export default class Emotion {



  render(){
    const {right, info} = this.props;
    return(
      <div className="emotion">
        <div className="emotion-header">
          <div className="emotion-header-inner">
            <span className="emotion-header-item"></span>
            <span className="emotion-header-item"></span>
            <span className="emotion-header-item"></span>
          </div>
        </div>
        <div className="emotion-bd">
          <div className="emotion-bd-item normal clearfix">
            <a title="Smile" type="qq" className="face">Smile</a>
            <a title="Grimace" type="qq" className="face">Grimace</a>
            <a title="Love" type="qq" className="face">Love</a>
            <a title="Scowl" type="qq" className="face">Scowl</a>
            <a title="Chill" type="qq" className="face">Chill</a>
            <a title="Sob" type="qq" className="face">Sob</a>
            <a title="Shy" type="qq" className="face">Shy</a><a title="Silent" type="qq" className="face">Silent</a><a title="Sleep" type="qq" className="face">Sleep</a><a title="Cry" type="qq" className="face">Cry</a><a title="Awkward" type="qq" className="face">Awkward</a><a title="Angry" type="qq" className="face">Angry</a><a title="Tongue" type="qq" className="face">Tongue</a><a title="Grin" type="qq" className="face">Grin</a><a title="Surprise" type="qq" className="face">Surprise</a><a title="Frown" type="qq" className="face">Frown</a><a title="Ruthless" type="qq" className="face">Ruthless</a><a title="Blush" type="qq" className="face">Blush</a><a title="Crazy" type="qq" className="face">Crazy</a><a title="Puke" type="qq" className="face">Puke</a><a title="Chuckle" type="qq" className="face">Chuckle</a><a title="Joyful" type="qq" className="face">Joyful</a><a title="Slight" type="qq" className="face">Slight</a><a title="Smug" type="qq" className="face">Smug</a><a title="Hungry" type="qq" className="face">Hungry</a><a title="Drowsy" type="qq" className="face">Drowsy</a><a title="Panic" type="qq" className="face">Panic</a><a title="Sweat" type="qq" className="face">Sweat</a><a title="Laugh" type="qq" className="face">Laugh</a><a title="Commando" type="qq" className="face">Commando</a><a title="Determined" type="qq" className="face">Determined</a><a title="Scold" type="qq" className="face">Scold</a><a title="Shocked" type="qq" className="face">Shocked</a><a title="Shhh" type="qq" className="face">Shhh</a><a title="Dead" type="qq" className="face">Dead</a><a title="Tormented" type="qq" className="face">Tormented</a><a title="Toasted" type="qq" className="face">Toasted</a><a title="Skull" type="qq" className="face">Skull</a><a title="Hammer" type="qq" className="face">Hammer</a><a title="Wave" type="qq" className="face">Wave</a><a title="Speechless" type="qq" className="face">Speechless</a><a title="NosePick" type="qq" className="face">NosePick</a><a title="Clap" type="qq" className="face">Clap</a><a title="Shame" type="qq" className="face">Shame</a><a title="Trick" type="qq" className="face">Trick</a><a title="Bah！L" type="qq" className="face">Bah！L</a><a title="Bah！R" type="qq" className="face">Bah！R</a><a title="Yawn" type="qq" className="face">Yawn</a><a title="Pooh-pooh" type="qq" className="face">Pooh-pooh</a><a title="Shrunken" type="qq" className="face">Shrunken</a><a title="TearingUp" type="qq" className="face">TearingUp</a><a title="Sly" type="qq" className="face">Sly</a><a title="Kiss" type="qq" className="face">Kiss</a><a title="Wrath" type="qq" className="face">Wrath</a><a title="Whimper" type="qq" className="face">Whimper</a><a title="Cleaver" type="qq" className="face">Cleaver</a><a title="Watermelon" type="qq" className="face">Watermelon</a><a title="Beer" type="qq" className="face">Beer</a><a title="Basketball" type="qq" className="face">Basketball</a><a title="PingPong" type="qq" className="face">PingPong</a><a title="Coffee" type="qq" className="face">Coffee</a><a title="Rice" type="qq" className="face">Rice</a><a title="Pig" type="qq" className="face">Pig</a><a title="Rose" type="qq" className="face">Rose</a><a title="Wilt" type="qq" className="face">Wilt</a><a title="Lip" type="qq" className="face">Lip</a><a title="Heart" type="qq" className="face">Heart</a><a title="BrokenHeart" type="qq" className="face">BrokenHeart</a><a title="Cake" type="qq" className="face">Cake</a><a title="Lightning" type="qq" className="face">Lightning</a><a title="Bomb" type="qq" className="face">Bomb</a><a title="Dagger" type="qq" className="face">Dagger</a><a title="Soccer" type="qq" className="face">Soccer</a><a title="Ladybug" type="qq" className="face">Ladybug</a><a title="Poop" type="qq" className="face">Poop</a><a title="Moon" type="qq" className="face">Moon</a><a title="Sun" type="qq" className="face">Sun</a><a title="Gift" type="qq" className="face">Gift</a><a title="Hug" type="qq" className="face">Hug</a><a title="ThumbsUp" type="qq" className="face">ThumbsUp</a><a title="ThumbsDown" type="qq" className="face">ThumbsDown</a><a title="Shake" type="qq" className="face">Shake</a><a title="Peace" type="qq" className="face">Peace</a><a title="Fight" type="qq" className="face">Fight</a><a title="Beckon" type="qq" className="face">Beckon</a><a title="Fist" type="qq" className="face">Fist</a><a title="Pinky" type="qq" className="face">Pinky</a><a title="RockOn" type="qq" className="face">RockOn</a><a title="Nuh-uh" type="qq" className="face">Nuh-uh</a><a title="OK" type="qq" className="face">OK</a><a title="InLove" type="qq" className="face">InLove</a><a title="Blowkiss" type="qq" className="face">Blowkiss</a><a title="Waddle" type="qq" className="face">Waddle</a><a title="Tremble" type="qq" className="face">Tremble</a><a title="Aaagh!" type="qq" className="face">Aaagh!</a><a title="Twirl" type="qq" className="face">Twirl</a><a title="Kotow" type="qq" className="face">Kotow</a><a title="Dramatic" type="qq" className="face">Dramatic</a><a title="JumpRope" type="qq" className="face">JumpRope</a><a title="Surrender" type="qq" className="face">Surrender</a><a title="Hooray" type="qq" className="face">Hooray</a><a title="Meditate" type="qq" className="face">Meditate</a><a title="Smooch" type="qq" className="face">Smooch</a><a title="TaiChi L" type="qq" className="face">TaiChi L</a><a title="TaiChi R" type="qq" className="face">TaiChi R</a>
          </div>
          <div className="emotion-bd-item"></div>
          <div className="emotion-bd-item">

          </div>
        </div>
      </div>
    );

  }


}