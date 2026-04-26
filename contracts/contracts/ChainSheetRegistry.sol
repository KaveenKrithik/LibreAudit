// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ChainSheetRegistry {
    struct FileRecord {
        string cid;
        string fileName;
        uint256 timestamp;
        address uploader;
    }

    FileRecord[] public records;
    mapping(address => uint256[]) public userRecords;

    event FileUploaded(string cid, string fileName, address indexed uploader, uint256 timestamp);

    function recordFile(string memory _cid, string memory _fileName) public {
        FileRecord memory newRecord = FileRecord({
            cid: _cid,
            fileName: _fileName,
            timestamp: block.timestamp,
            uploader: msg.sender
        });
        
        records.push(newRecord);
        userRecords[msg.sender].push(records.length - 1);
        
        emit FileUploaded(_cid, _fileName, msg.sender, block.timestamp);
    }

    function getRecordsCount() public view returns (uint256) {
        return records.length;
    }

    function getUserRecords(address _user) public view returns (FileRecord[] memory) {
        uint256[] memory indices = userRecords[_user];
        FileRecord[] memory userFileRecords = new FileRecord[](indices.length);
        for (uint256 i = 0; i < indices.length; i++) {
            userFileRecords[i] = records[indices[i]];
        }
        return userFileRecords;
    }

    function getAllRecords() public view returns (FileRecord[] memory) {
        return records;
    }
}
