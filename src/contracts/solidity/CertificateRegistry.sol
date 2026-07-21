// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CertificateRegistry {
    struct Certificate {
        string studentName;
        string courseName;
        string certificateHash;
        bool exists;
    }

    mapping(string => Certificate) private certificates;
    string[] private certificateIds;

    event CertificateIssued(string indexed certificateId, string studentName, string courseName, string certificateHash);

    function issueCertificate(
        string memory certificateId,
        string memory studentName,
        string memory courseName,
        string memory certificateHash
    ) public {
        require(!certificates[certificateId].exists, "Certificate already exists");

        certificates[certificateId] = Certificate({
            studentName: studentName,
            courseName: courseName,
            certificateHash: certificateHash,
            exists: true
        });
        certificateIds.push(certificateId);

        emit CertificateIssued(certificateId, studentName, courseName, certificateHash);
    }

    function getCertificate(string memory certificateId) public view returns (Certificate memory) {
        require(certificates[certificateId].exists, "Certificate does not exist");
        return certificates[certificateId];
    }

    function getCertificateCount() public view returns (uint256) {
        return certificateIds.length;
    }
}
