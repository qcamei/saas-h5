import {MembershipCard} from "./MembershipCard";
import {ProductCard} from "./ProductCard";
import {EntityStateEnum} from "./EntityStateEnum";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {CardStatusEnum} from "./CardStatusEnum";
import {PrdCardType} from "./PrdCardType";
export class StoreCardInfo {
    constructor(){}
    id:number;
    storeId:number;
    membershipCardIndex:number;
    productCardIndex:number;
    membershipCardMap:Array<MembershipCard>;
    productCardMap:Array<ProductCard>;
    prdCardTypeIndex:number;
    prdCardTypeMap :Array<PrdCardType>;
    splitMark:number;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;

    //遗留字段
    // discountCardIdIndex:number;
    // discountCardMap:Array<DiscountCard>;



  public getMemberCardList(): Array<MembershipCard> {
    let memberCardMap = this.membershipCardMap;
    let memberCardArray = new Array<MembershipCard>();
    for (var key in memberCardMap) {
      let memberCardTmp: MembershipCard = new MembershipCard();
      AppUtils.copy(memberCardTmp, memberCardMap[key]);
      memberCardArray.push(memberCardTmp);
    }
    return memberCardArray;
  }

  public getValidMemberCardList(): Array<MembershipCard> {
    let memberCardMap = this.membershipCardMap;
    let memberCardArray = new Array<MembershipCard>();
    for (var key in memberCardMap) {
      let memberCardTmp: MembershipCard = new MembershipCard();
      if (memberCardMap[key].entityState == EntityStateEnum.Normal) {
        AppUtils.copy(memberCardTmp, memberCardMap[key]);
        memberCardArray.push(memberCardTmp);
      }
    }
    return memberCardArray;
  }

  public getMemberCardDetail(mdCardId: string): MembershipCard {

    let memberCardList = this.getMemberCardList();
    let memberCardTmp = new MembershipCard();
    for (let memberCard of memberCardList) {
      if (mdCardId == memberCard.id) {
        memberCardTmp = memberCard;
        break;
      }
    }
    return memberCardTmp;
  }

  public getValidProductCardList(): Array<ProductCard> {
    let productCardMap = this.productCardMap;
    let productCardArray = new Array<ProductCard>();

    for (var key in productCardMap) {
      let productCardTmp: ProductCard = new ProductCard();
      if (productCardMap[key].entityState == EntityStateEnum.Normal) {
        AppUtils.copy(productCardTmp, productCardMap[key]);
        productCardArray.push(productCardTmp);
      }

    }
    return productCardArray;
  }

  public getProductCardList(): Array<ProductCard> {
    let productCardMap = this.productCardMap;
    let productCardArray = new Array<ProductCard>();

    for (var key in productCardMap) {
      let productCardTmp: ProductCard = new ProductCard();
      AppUtils.copy(productCardTmp, productCardMap[key]);
      productCardArray.push(productCardTmp);
    }
    return productCardArray;
  }

  public getProductCardDetail(prdCardId: string): ProductCard {
    let productCardList = this.getValidProductCardList();
    let productCardTmp = new ProductCard();
    for (let productCard of productCardList) {
      if (prdCardId == productCard.id) {
        AppUtils.copy(productCardTmp,productCard);
        break;
      }
    }
    return productCardTmp;
  }

  public getMemberCardMap(): ZmMap<MembershipCard> {
    let memberCardMap = new ZmMap<MembershipCard>();
    for (let index in this.membershipCardMap) {
      let membershipCard = this.membershipCardMap[index];
      memberCardMap.put(membershipCard.id, membershipCard);
    }
    return memberCardMap;
  }

  public getValidMemberCardMap(): ZmMap<MembershipCard> {
    let memberCardMap = new ZmMap<MembershipCard>();
    for (let index in this.membershipCardMap) {
      let membershipCard = this.membershipCardMap[index];
      if (membershipCard.entityState == EntityStateEnum.Normal) {
        memberCardMap.put(membershipCard.id, membershipCard);
      }
    }
    return memberCardMap;
  }


  public getOpenMemberCardMap(): ZmMap<MembershipCard> {
    let memberCardMap = new ZmMap<MembershipCard>();
    for (let index in this.membershipCardMap) {
      let membershipCard = this.membershipCardMap[index];
      if (membershipCard.entityState ==EntityStateEnum.Normal && membershipCard.status == CardStatusEnum.OPEN) {
        memberCardMap.put(membershipCard.id, membershipCard);
      }
    }
    return memberCardMap;
  }

  public getValidProductCardMap(): ZmMap<ProductCard> {
    let productCardMap = new ZmMap<ProductCard>();
    for (let index in this.productCardMap) {
      let productCard = this.productCardMap[index];
      if (productCard.entityState == EntityStateEnum.Normal) {
        productCardMap.put(productCard.id, productCard);
      }
    }
    return productCardMap;
  }

  public getProductCardMap(): ZmMap<ProductCard> {
    let productCardMap = new ZmMap<ProductCard>();
    for (let index in this.productCardMap) {
      let productCard = this.productCardMap[index];
      productCardMap.put(productCard.id, productCard);
    }
    return productCardMap;
  }

  public getOpenProductCardMap(): ZmMap<ProductCard> {
    let productCardMap = new ZmMap<ProductCard>();
    for (let index in this.productCardMap) {
      let productCard = this.productCardMap[index];
      if (productCard.entityState == EntityStateEnum.Normal && productCard.status == CardStatusEnum.OPEN) {
        productCardMap.put(productCard.id, productCard);
      }
    }
    return productCardMap;
  }

  public getValidProductCardTypeMap(): ZmMap<PrdCardType> {
    let productCardTypeMap = new ZmMap<PrdCardType>();
    for (let index in this.prdCardTypeMap) {
      let productCardType = this.prdCardTypeMap[index];
      if (productCardType.entityState == EntityStateEnum.Normal) {
        productCardTypeMap.put(productCardType.id.toString(), productCardType);
      }
    }
    return productCardTypeMap;
  }

  public getAllProductCardTypeMap(): ZmMap<PrdCardType> {
    let productCardTypeMap = new ZmMap<PrdCardType>();
    for (let index in this.prdCardTypeMap) {
      let productCardType = this.prdCardTypeMap[index];
      productCardTypeMap.put(productCardType.id.toString(), productCardType);

    }
    return productCardTypeMap;
  }

}
