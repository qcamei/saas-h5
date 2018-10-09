import {ZmMap} from "../../../comModule/AppUtils";
import {EntityStateEnum} from "../../../comModule/enum/EntityStateEnum";
import {PrdCardType} from "./PrdCardType";
import {CardStatusEnum} from "./CardStatusEnum";
import {ProductCard} from "./ProductCard";
import {MembershipCard} from "./MembershipCard";
export class ChainCard {
    constructor(){}
    id:number;
    chainId:number;
    membershipCardIndex:number;
    membershipCardMap:any;//ZmMap<MembershipCard>
    productCardIndex:number;
    productCardMap:any;//ZmMap<ProductCard>
    prdCardTypeIndex:number;
    prdCardTypeMap:any;//ZmMap<PrdCardType>
    splitMark:number;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;

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
