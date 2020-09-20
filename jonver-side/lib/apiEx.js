module.exports = `
    GET /code/checkCode
    <br><br>
    각 회사와 그에 해당하는 code를 확인
    <br><br>
    GET /code/all
    <br><br>
    모든 회사의 모든 정보를 가져옴
    <br><br>
    GET /code/{code}
    <br><br>
    {code}에 해당하는 회사의 모든 정보를 가져옴
    <br><br>
    "price" - 실시간 가격 정보로 최대 20분까지 지연됩니다.
    <br><br>
    "priceopen" - 개장 시점의 가격입니다.
    <br><br>
    "high" - 현재 날짜의 최고가입니다.
    <br><br>
    "low" - 현재 날짜의 최저가입니다.
    <br><br>
    "volume" - 현재 날짜의 거래량입니다.
    <br><br>
    "marketcap" - 주식의 시가 총액입니다.
    <br><br>
    "tradetime" - 마지막 거래 시간입니다.
    <br><br>
    "datadelay" - 실시간 데이터의 지연 정도입니다.
    <br><br>
    "volumeavg" - 일일 평균 거래량입니다.
    <br><br>
    "pe" - 가격 대 수익률입니다.
    <br><br>
    "eps" - 주당 순이익입니다.
    <br><br>
    "high52" - 52주 최고가입니다.
    <br><br>
    "low52" - 52주 최저가입니다.
    <br><br>
    "change" - 전 거래일 마감 이후의 가격 변동입니다.
    <br><br>
    "beta" - 베타 값입니다.
    <br><br>
    "changepct" - 전 거래일 마감 이후 주식 가격의 백분율 변동입니다.
    <br><br>
    "closeyest" - 전일 종가입니다.
    <br><br>
    "shares" - 발행 주식 수입니다.
`;
