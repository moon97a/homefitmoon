import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Member } from "shared";  
const MemberRegisterForm = ({ member }: { member?: Member | null }) => {
  if (!member) 
    member = {
      id: '', name: '', img: '/default-avatar.png',
      sex: '', age: 0, membership: ''
    } as Member;

  return (
    <FieldGroup className="max-w-4xl mx-auto">
      <FieldSet>
        <FieldLegend className="text-center mb-8">회원 정보</FieldLegend>
        
        {/* 가로 2단: 좌측 프로필, 우측 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* 좌측: 프로필 + 이미지 강조 */}
          <div className="flex flex-col items-center gap-8 p-8 bg-linear-to-br from-muted/50 to-background rounded-2xl">
            <div className="relative">
              <img 
                src={member.img} 
                alt={member.name}
                className="w-25 h-25 lg:w-48 lg:h-48 rounded-full ring-8 ring-primary/30 object-cover shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{member.age}</span>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-foreground to-primary bg-clip-text">
                {member.name}
              </h2>
              <p className="text-xl text-muted-foreground mt-2">
                {member.sex}
              </p>
            </div>
          </div>

          {/* 우측: 상세 정보 테이블 */}
          <div className="space-y-6">
            <FieldSet className="p-8 border rounded-2xl bg-muted/30"> 
              <FieldLegend className="mb-6">기본 정보</FieldLegend>
              <Field>
                <FieldLabel htmlFor="input-demo-api-key">회원 ID<Sparkles/></FieldLabel>
                <Input id="input-demo-api-key" value={member.id}  placeholder="예) U0001 ..." className="bg-primary-foreground"/>
                <FieldDescription>
                  문자로 시작하는 5자리 이상의 문자열을 입력해 주세요. 특수문자는 [@ . _]만 허용됩니다.
                </FieldDescription>
              </Field>       
              <Field>
                <FieldLabel htmlFor="input-name">회원 이름<Sparkles/></FieldLabel>
                <Input id="input-name" value={member.name}  placeholder="예) 홍길동 ..." className="bg-primary-foreground"/>
              </Field>                              
              <Field >
                <FieldLabel htmlFor="input-sex">성별<Sparkles/></FieldLabel>
                <Select>
                  <SelectTrigger className="w-full max-w-48 bg-primary-foreground">
                    <SelectValue placeholder="성별을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent id="input-sex">
                    <SelectGroup>
                      <SelectLabel>성별</SelectLabel>
                      <SelectItem value="M">남자</SelectItem>
                      <SelectItem value="F">여자</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>나이</FieldLabel>
                <Input
                  type="number"  // 👈 숫자만 입력
                  min={0}
                  max={120}
                  value={member?.age}
                  className="w-24"
                  placeholder="0"
                />
                <FieldDescription>0 ~ 120세</FieldDescription>
              </Field>              
            </FieldSet>

            {/* 멤버십 강조 영역 */}
            <FieldSet className="p-8 border rounded-2xl bg-linear-to-r from-primary/5 to-secondary/5">
              <FieldLegend className="mb-4 flex items-center gap-2">
                멤버십
                <Badge variant={member.membership === 'V' ? "default" : "secondary"} className="text-sm">
                  {member.membership}
                </Badge>
              </FieldLegend>
              <div className="text-4xl font-black text-center text-primary/80 tracking-wide">
                {member.membership === 'V' ? 'VIP' : member.membership === 'N' ? '일반' : '무료'}
              </div>
            </FieldSet>
          </div>
        </div>

        {/* 하단 버튼 (전체 너비) */}
        <FieldSeparator className="my-12" />
        <Field orientation="horizontal" className="justify-center gap-4">
          <Button variant="outline" size="lg" className="px-12">정보 수정</Button>
          <Button variant="destructive" size="lg" className="px-12">회원 탈퇴</Button>
        </Field>
      </FieldSet>
    </FieldGroup>
  );
};

export default MemberRegisterForm;
