# BackupMaker
mysql 서버 백업 -> 암호화 스크립트 및 복호화 스크립트


mysqldump.exe가 path에 등록되어 있어야 합니다.

.env 파일에 아래 내용 기입
- DESTINATION_IP=[목적지 db서버 ip]
- DESTINATION_PORT=[목적지 db서버 포트]
- ENCRYPT_KEY=[32byte로 구성된 임의의 문자열]

mysql config파일에 인증 관련 설정을 추가해서 프롬프트 상에 passphrase 요구가 뜨지 않도록 하면 ok


시스템 시간을 임의로 변경할 경우 오작동할 수 있습니다.
