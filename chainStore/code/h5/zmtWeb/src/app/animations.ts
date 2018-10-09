// import { AnimationEntryMetadata, state } from '@angular/core';
// import {trigger, transition, animate, style, query, group, keyframes, stagger} from '\@angular/animations';
//
// export const routeAnimation: AnimationEntryMetadata =
//   trigger('routeAnimation', [
//     transition(':enter', [
//       style({
//         // position: ''
//       }),
//       animate('0.1s ease-in-out')
//     ]),
//     transition('* => *', [
//       query(':leave', style({ transform: 'translateX(0)', position: 'fixed',width:'calc(100% - 260px)',opacity:'0'}), { optional: true }),//离开开始位置
//       query(':enter',
//         style({ transform: 'translateY(100px)', position: 'fixed',width:'calc(100% - 260px)'}), { optional: true }),//进来开始位置
//
//
//       group([
//         query(':leave',animate('.5s ease-in-out', style({transform: 'translate(-110% ,-110%)',width:'calc(100% - 260px)'})), { optional: true }),//离开结束位置
//         query(':enter', animate('.5s ease-in-out', style({transform: 'translateY(0)',width:'calc(100% - 260px)'})), { optional: true })//进来结束位置
//
//       ])
//     ]),
//   ]);
