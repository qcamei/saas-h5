import {Component} from '@angular/core';
import {IonicPage} from "ionic-angular";

@IonicPage({
  name: "protocol",
  segment: 'protocol'
})

@Component({
  template: `
    <zm-page-header title="用户协议"></zm-page-header>
    <zm-page-content>
      <div style="padding:0 15px 20px 15px;">
        <h3 class="protocol-title">本软件最终用户许可协议</h3>

        <div class="protocol-section" text-indent>重要须知——请认真阅读：本《最终用户许可协议》（以下称《协议》）是您（单一实体）与 本软件软件产品之间有关上述本软件软件产品的法律协议。</div>

        <div class="protocol-section" text-indent>本“软件产品”包括计算机软件，并可能包括相关微信公众号以及小程序、印刷材料或电子文档（“软件产品”操作手册）。本“软件产品”还包括本软件软件产品提供给您的原“软件产品”的任何更新和补充资料。任何与本“软件产品”一同提供给您的并与单独一份最终用户许可证相关的软件产品是根据那份许可协议中的条款而授予您。您一旦安装、复制、下载、访问或以其它方式使用本“软件产品”，即表示您同意接受本协议各项条款的约束。如您不同意本协议中的条款，请不要安装或使用本“软件产品”。</div>

        <div class="protocol-section protocol-section-bold"><b>软件产品许可证</b></div>
        <div class="protocol-section" text-indent>本“软件产品”受著作权法及国际著作权条约和其它知识产权法和条约的保护。本“软件产品”只许可使用，而不出售。</div>
        <div class="protocol-section"><b>1. 许可证的授予。本《协议》授予您下列权利：</b></div>
        <div class="protocol-section" text-indent>1.1应用软件。您可在单一一台计算机/手机设备上安装、使用、访问、显示、运行本“软件产品” （或适用于同一操作系统的任何前版本）的一份副本。</div>
        <div class="protocol-section" text-indent>1.2储存／网络用途。您还可以在您公司的其它计算机/手机设备上运行“软件产品”但仅限于注册时所添之项目，您必须为增加的每个项目获得一份许可证。</div>
        <div class="protocol-section" text-indent>1.3保留权利。未明示授予的一切其它权利均为广州智美时代科技有限公司所有。</div>
        <div class="protocol-section"><b>2. 其它权利和限制的说明：</b></div>
        <div class="protocol-section" text-indent>2.1试用版本。仅限于试用，如需正式使用，必须购买成为正式版。</div>
        <div class="protocol-section" text-indent>2.2组件的分隔。本“软件产品”是作为单一产品而被授予使用许可的，您不得将其组成部分分开在多台计算机上使用。</div>
        <div class="protocol-section" text-indent>2.3商标。本《协议》不授予您有关任何本软件系统商标或服务商标的任何权利。</div>
        <div class="protocol-section" text-indent>2.4出租。不得出租、租赁或出借本“软件产品”。</div>
        <div class="protocol-section" text-indent>2.5支持服务。广州智美时代科技有限公司可能为您提供与“软件产品”有关的支持服务：支持服务的操作手册、联机文档或其它提供的材料中所述的各项政策和计划的制约。提供给您作为支持服务的一部份的任何附加软件代码应被视为本“软件产品”的一部分，并须符合本《协议》中的各项条款和条件。至于您提供给广州智美时代科技有限公司作为支持服务的一部分的技术信息，广州智美时代科技有限公司可将其用于商业用途，包括产品支持和开发。广州智美时代科技有限公司在使用这些技术信息时不会以个人形式提及您。</div>
        <div class="protocol-section" text-indent>2.6软件转让。本"软件产品"的第一被许可人不可以对本《协议》及“软件产品”直接或间接向任何用户作转让。</div>
        <div class="protocol-section" text-indent>2.7终止。如您未遵守本《协议》的各项条款和条件，在不损害其它权利的情况下，广州智美时代科技有限公司可终止本《协议》。如此类情况发生，您必须销毁“软件产品”的所有副本及其所有组成部分。</div>
      
        <div class="protocol-section" text-indent><b>3. 升级版本。如本“软件产品”标明为升级版本，您必须获取广州智美时代科技有限公司标明为合格使用升级版本的产品的许可证方可使用本“软件产品” 。标明为升级版本的“软件产品”替换或补充使您有资格使用升级版本的基础的产品，您只可根据本《协议》的条款使用所产生的升级产品。如本“软件产品”是您获得许可作为单一产品使用的一套软件程序包中一个组件的升级版本，则本“软件产品”只可作为该单一产品包的一部分而使用和转让，并且不可将其分开使用在一台以上的计算机上。</b></div>
        <div class="protocol-section" text-indent><b>4. 著作权。本“软件产品”（包括但不限于本“软件产品”中所含的任何图象、照片、动画、录像、录音、音乐、文字和附加程序）、随附的印刷材料、及本“软件产品”的任何副本的产权和著作权，均由广州智美时代科技有限公司拥有。通过使用“软件产品”可访问的内容的一切所有权和知识产权均属于各自内容所有者拥有，并可能受适用著作权或其它知识产权法和条约的保护。 本《协议》不授予您使用这些内容的权利。如果这份“软件产品”包括只以电子形式提供的文档，您可以打印一份该电子文档。您不可复制本“软件产品”随附的印刷材料。</b></div>
        <div class="protocol-section" text-indent ><b>5. 备份副本。在按照本《协议》安装一份本“软件产品”副本后，您可以保留广州智美时代科技有限公司用以提供给您本“软件产品”的原媒体，仅用于备份或存档之用。如果需要原媒体方可在计算机上使用“软件产品”，您可以复制一份“软件产品”副本仅用于备份或存档之用。除本《协议》中明文规定外，您不可复制本“软件产品”或随附本“软件产品”的印刷材料。如您是在中华人民共和国取得此广州智美时代科技有限公司软件产品，下列有限保证适用于您：</b></div>
        <div class="protocol-section"text-indent>5.1有限责任。 在适用法律所允许的最大范围内，广州智美时代科技有限责任公司在任何情况下绝不就因使用或不能使用“软件产品”或因提供或未提供支持服务所发生的任何特殊的、意外的、非直接的或间接的损失（包括，但不限于营业利润损失、营业中断、商业信息的遗失或任何其他金钱上的损失）承担赔偿责任，即使广州智美时代科技有限公司事先被告知该损害发生的可能性。不论任何情况，广州智美时代科技有限公司在本《协议》任何条款下所承担的全部责任，以您就“软件产品”实际已付的价款为准。 但是，如果您已经与广州智美时代科技有限公司达成支持服务协议，广州智美时代科技有限公司就支持服务的全部赔偿责任应以该协议条款为准。</div>
        <div class="protocol-section protocol-section-bold">本《协议》受中华人民共和国法律管辖。如果您对本《协议》有什么问题，请同广州智美时代科技有限公司联系。</div>

      </div>
    </zm-page-content>
  `,
  styles:[`
  [text-indent]{
    text-indent:25px;
  }
  .protocol-title{
    text-align:center;
    font-weight:bold;
    font-size:16px;
  }
  
  `]
})
export class ProtocolPage{

  constructor() {
  }

  ionViewDidEnter() {
  }

}





