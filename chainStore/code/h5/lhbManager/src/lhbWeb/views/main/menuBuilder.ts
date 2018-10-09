
export class MenuBuilder{

  public static buildMenu(){
    let sideBarMenu = {
      //管理
      manage:[
        {
          title: '排行榜管理',
          img:'icon-project',
          selected:false,
          children: [
            {
              title: '排行榜列表',
              img:'icon-staff',
              link: '/main/buser/buserList',
              selected:false,
              permission:true
            },
            {
              title: '员工加入审核',
              img:'icon-staff',
              link: '/main/buserCheck/buserCheckList',
              selected:false,
              permission:true
            }
          ],
        },



      ]
    };

    return sideBarMenu;
  }

}

