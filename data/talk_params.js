var __reimuBossTalkParams = [ ] ;
var __marisaBossTalkParams = [ ] ;

__reimuBossTalkParams.push(
  { 'serif': 'Hi, how\'re you doing, Rumia?',
    'left':  { 'character': 'reimu', 'active': true },
    'right': { 'character': 'rumia' },
  }
) ;

__reimuBossTalkParams.push(
  { 'serif': 'Good. But hungry. Can I eat you?',
    'left':  { 'character': 'reimu' },
    'right': { 'character': 'rumia', 'active': true },
  }
) ;

__reimuBossTalkParams.push(
  { 'serif': 'Sorry, I\'m busy now.\nI can play with you after I solve the Ihen.',
    'left':  { 'character': 'reimu', 'active': true },
    'right': { 'character': 'rumia' },
  }
) ;


__marisaBossTalkParams.push(
  { 'serif': 'Hi, Marisa. What are you doing now?',
    'left':  { 'character': 'marisa' },
    'right': { 'character': 'rumia', 'active': true },
  }
) ;

__marisaBossTalkParams.push(
  { 'serif': 'Ah? I just enjoy flying now.',
    'left':  { 'character': 'marisa', 'active': true},
    'right': { 'character': 'rumia' },
  }
) ;

__marisaBossTalkParams.push(
  { 'serif': 'So-nano-ka-?',
    'left':  { 'character': 'marisa' },
    'right': { 'character': 'rumia',  'active': true },
  }
) ;

var __stage1BossTalkParams = [ ] ;
__stage1BossTalkParams.push( __reimuBossTalkParams ) ;
__stage1BossTalkParams.push( __marisaBossTalkParams ) ;

var __reimuClearTalkParams = [ ] ;

__reimuClearTalkParams.push(
  { 'serif': 'Got tired.',
    'left':  { 'character': 'reimu', 'active': true },
  }
) ;

var __marisaClearTalkParams = [ ] ;

__marisaClearTalkParams.push(
  { 'serif': 'I\'ve done it.',
    'left':  { 'character': 'marisa', 'active': true },
  }
) ;

var __stage1ClearTalkParams = [ ] ;
__stage1ClearTalkParams.push( __reimuClearTalkParams ) ;
__stage1ClearTalkParams.push( __marisaClearTalkParams ) ;

var __stage1TalksParams = [ ] ;
__stage1TalksParams.push( __stage1BossTalkParams ) ;
__stage1TalksParams.push( __stage1ClearTalkParams ) ;


var __reimuBossTalk2Params = [ ] ;
__reimuBossTalk2Params.push(
  { 'serif': 'Sorry, I have no topics.',
    'left':  { 'character': 'reimu', 'active': true },
    'right': { 'character': 'chilno' },
  }
) ;

__reimuBossTalk2Params.push(
  { 'serif': 'W-What\'s!?',
    'left':  { 'character': 'reimu' },
    'right': { 'character': 'chilno', 'active': true },
  }
) ;


var __marisaBossTalk2Params = [ ] ;
__marisaBossTalk2Params.push(
  { 'serif': 'Sorry, I have no topics.',
    'left':  { 'character': 'marisa', 'active': true },
    'right': { 'character': 'chilno' },
  }
) ;

__marisaBossTalk2Params.push(
  { 'serif': 'W-What\'s!?',
    'left':  { 'character': 'marisa' },
    'right': { 'character': 'chilno', 'active': true },
  }
) ;


var __stage2BossTalkParams = [ ] ;
__stage2BossTalkParams.push( __reimuBossTalk2Params ) ;
__stage2BossTalkParams.push( __marisaBossTalk2Params ) ;


var __stage2TalksParams = [ ] ;
__stage2TalksParams.push( __stage2BossTalkParams ) ;
__stage2TalksParams.push( __stage1ClearTalkParams ) ; // TODO: temporal


var __talkParams = [ ] ;
__talkParams.push( __stage1TalksParams ) ;
__talkParams.push( __stage2TalksParams ) ;

